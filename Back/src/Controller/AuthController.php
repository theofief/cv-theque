<?php

namespace App\Controller;

use App\Entity\Account;
use App\Repository\AccountRepository;
use App\Security\JwtService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/auth')]
class AuthController extends AbstractController
{
    public function __construct(private readonly JwtService $jwtService)
    {
    }

    #[Route('/login', name: 'api_auth_login', methods: ['POST'])]
    public function login(Request $request, AccountRepository $accountRepository): JsonResponse
    {
        $payload = $this->decodePayload($request);
        if (!is_array($payload)) {
            return $this->json(['error' => 'Payload JSON invalide.'], Response::HTTP_BAD_REQUEST);
        }

        $email = mb_strtolower(trim((string) ($payload['email'] ?? '')));
        $password = (string) ($payload['password'] ?? '');

        $account = $accountRepository->findOneByEmail($email);
        if (!$account instanceof Account) {
            return $this->json(['error' => 'Identifiants invalides.'], Response::HTTP_UNAUTHORIZED);
        }

        if (!password_verify($password, $account->getPasswordHash())) {
            return $this->json(['error' => 'Identifiants invalides.'], Response::HTTP_UNAUTHORIZED);
        }

        $token = $this->jwtService->issueToken([
            'sub' => $account->getId(),
            'email' => $account->getEmail(),
            'profile_type' => $account->getProfileType(),
            'is_admin' => $account->isAdmin(),
        ], 60 * 60 * 8);

        return $this->json([
            'token' => $token,
            'tokenType' => 'Bearer',
            'expiresIn' => 60 * 60 * 8,
            'user' => $this->normalizeAccount($account),
        ]);
    }

    #[Route('/register', name: 'api_auth_register', methods: ['POST'])]
    public function register(
        Request $request,
        AccountRepository $accountRepository,
        EntityManagerInterface $entityManager,
    ): JsonResponse {
        $payload = $this->decodePayload($request);
        if (!is_array($payload)) {
            return $this->json(['error' => 'Payload JSON invalide.'], Response::HTTP_BAD_REQUEST);
        }

        $email = mb_strtolower(trim((string) ($payload['email'] ?? '')));
        $password = (string) ($payload['password'] ?? '');
        $profileType = strtolower(trim((string) ($payload['profileType'] ?? 'student')));
        $displayName = trim((string) ($payload['displayName'] ?? ''));
        $schoolName = $this->nullableString($payload['schoolName'] ?? null);
        $companyName = $this->nullableString($payload['companyName'] ?? null);

        $allowedTypes = ['school', 'company', 'student'];

        if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            return $this->json(['error' => 'Adresse email invalide.'], Response::HTTP_BAD_REQUEST);
        }

        if (strlen($password) < 8) {
            return $this->json(['error' => 'Mot de passe trop court (8 caracteres min).'], Response::HTTP_BAD_REQUEST);
        }

        if (!in_array($profileType, $allowedTypes, true)) {
            return $this->json(['error' => 'Type de profil invalide.'], Response::HTTP_BAD_REQUEST);
        }

        if ($displayName === '') {
            return $this->json(['error' => 'Nom du profil requis.'], Response::HTTP_BAD_REQUEST);
        }

        if ($profileType === 'student' && $schoolName === null) {
            return $this->json(['error' => 'Un etudiant doit etre lie a une ecole.'], Response::HTTP_BAD_REQUEST);
        }

        if ($profileType === 'school' && $schoolName === null) {
            $schoolName = $displayName;
        }

        if ($profileType === 'company' && $companyName === null) {
            $companyName = $displayName;
        }

        if ($accountRepository->findOneByEmail($email) instanceof Account) {
            return $this->json(['error' => 'Un compte existe deja avec cet email.'], Response::HTTP_CONFLICT);
        }

        $account = (new Account())
            ->setId('acc-'.bin2hex(random_bytes(8)))
            ->setEmail($email)
            ->setPasswordHash(password_hash($password, PASSWORD_DEFAULT))
            ->setProfileType($profileType)
            ->setDisplayName($displayName)
            ->setSchoolName($schoolName)
            ->setCompanyName($companyName)
            ->setIsAdmin(false);

        $entityManager->persist($account);
        $entityManager->flush();

        $token = $this->jwtService->issueToken([
            'sub' => $account->getId(),
            'email' => $account->getEmail(),
            'profile_type' => $account->getProfileType(),
            'is_admin' => $account->isAdmin(),
        ], 60 * 60 * 8);

        return $this->json([
            'token' => $token,
            'tokenType' => 'Bearer',
            'expiresIn' => 60 * 60 * 8,
            'user' => $this->normalizeAccount($account),
        ], Response::HTTP_CREATED);
    }

    #[Route('/me', name: 'api_auth_me', methods: ['GET'])]
    public function me(Request $request, AccountRepository $accountRepository): JsonResponse
    {
        $authorization = $request->headers->get('Authorization', '');
        if (!str_starts_with($authorization, 'Bearer ')) {
            return $this->json(['error' => 'Authentification requise.'], Response::HTTP_UNAUTHORIZED);
        }

        $token = trim(substr($authorization, 7));
        $payload = $this->jwtService->verifyToken($token);
        if (!is_array($payload)) {
            return $this->json(['error' => 'Token invalide ou expire.'], Response::HTTP_UNAUTHORIZED);
        }

        $accountId = $payload['sub'] ?? null;
        if (!is_string($accountId) || $accountId === '') {
            return $this->json(['error' => 'Token invalide.'], Response::HTTP_UNAUTHORIZED);
        }

        $account = $accountRepository->find($accountId);
        if (!$account instanceof Account) {
            return $this->json(['error' => 'Compte introuvable.'], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json(['user' => $this->normalizeAccount($account)]);
    }

    /** @return array<string, mixed>|null */
    private function decodePayload(Request $request): ?array
    {
        try {
            $payload = json_decode((string) $request->getContent(), true, flags: JSON_THROW_ON_ERROR);

            return is_array($payload) ? $payload : null;
        } catch (\JsonException) {
            return null;
        }
    }

    private function nullableString(mixed $value): ?string
    {
        if (!is_string($value)) {
            return null;
        }

        $trimmed = trim($value);

        return $trimmed === '' ? null : $trimmed;
    }

    /** @return array<string, mixed> */
    private function normalizeAccount(Account $account): array
    {
        return [
            'id' => $account->getId(),
            'email' => $account->getEmail(),
            'profileType' => $account->getProfileType(),
            'displayName' => $account->getDisplayName(),
            'isAdmin' => $account->isAdmin(),
            'schoolName' => $account->getSchoolName(),
            'companyName' => $account->getCompanyName(),
        ];
    }
}
