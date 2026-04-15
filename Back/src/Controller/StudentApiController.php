<?php

namespace App\Controller;

use App\Entity\Student;
use App\Repository\StudentRepository;
use App\Security\StringCipherService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/students')]
class StudentApiController extends AbstractController
{
    public function __construct(private readonly StringCipherService $cipher)
    {
    }

    #[Route('', name: 'api_students_list', methods: ['GET'])]
    public function list(StudentRepository $studentRepository): JsonResponse
    {
        $students = $studentRepository->findBy([], ['createdAt' => 'DESC']);

        return $this->json(array_map([$this, 'normalizeStudent'], $students));
    }

    #[Route('', name: 'api_students_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $payload = $this->decodePayload($request);
        if ($payload === null) {
            return $this->json(['error' => 'Payload JSON invalide.'], Response::HTTP_BAD_REQUEST);
        }

        [$valid, $errors] = $this->validatePayload($payload);
        if (!$valid) {
            return $this->json(['error' => implode(' ', $errors)], Response::HTTP_BAD_REQUEST);
        }

        $plainEmail = $this->sanitizeString($payload['email']);
        if (filter_var($plainEmail, FILTER_VALIDATE_EMAIL) === false) {
            return $this->json(['error' => 'Le champ "email" est invalide.'], Response::HTTP_BAD_REQUEST);
        }

        $student = (new Student())
            ->setId($this->generateStudentId())
            ->setFirstName($this->sanitizeString($payload['firstName']))
            ->setLastName($this->sanitizeString($payload['lastName']))
            ->setAge((int) $payload['age'])
            ->setRole($this->sanitizeString($payload['role']))
            ->setLocation($this->sanitizeString($payload['location']))
            ->setSchoolName($this->sanitizeString($payload['schoolName']))
            ->setCompanyName($this->nullableSanitizedString($payload['companyName'] ?? null))
            ->setOwnerAccountId($this->extractAccountIdFromRequest($request))
            ->setBio($this->sanitizeString($payload['bio']))
            ->setEmail($this->cipher->encrypt($plainEmail))
            ->setAvailability($this->sanitizeString($payload['availability']))
            ->setFeatured((bool) $payload['featured'])
            ->setSkills($this->normalizeSkills($payload['skills']))
            ->setProjects($this->normalizeProjects($payload['projects']))
            ->touch();

        $entityManager->persist($student);
        $entityManager->flush();

        return $this->json($this->normalizeStudent($student), Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'api_students_update', methods: ['PUT'])]
    public function update(
        string $id,
        Request $request,
        StudentRepository $studentRepository,
        EntityManagerInterface $entityManager,
    ): JsonResponse {
        if (!$this->isAdminRequest($request)) {
            return $this->json(['error' => 'Action reservee aux comptes admin.'], Response::HTTP_FORBIDDEN);
        }

        $student = $studentRepository->find($id);
        if (!$student instanceof Student) {
            return $this->json(['error' => 'Profil introuvable.'], Response::HTTP_NOT_FOUND);
        }

        $payload = $this->decodePayload($request);
        if ($payload === null) {
            return $this->json(['error' => 'Payload JSON invalide.'], Response::HTTP_BAD_REQUEST);
        }

        [$valid, $errors] = $this->validatePayload($payload);
        if (!$valid) {
            return $this->json(['error' => implode(' ', $errors)], Response::HTTP_BAD_REQUEST);
        }

        $plainEmail = $this->sanitizeString($payload['email']);
        if (filter_var($plainEmail, FILTER_VALIDATE_EMAIL) === false) {
            return $this->json(['error' => 'Le champ "email" est invalide.'], Response::HTTP_BAD_REQUEST);
        }

        $student
            ->setFirstName($this->sanitizeString($payload['firstName']))
            ->setLastName($this->sanitizeString($payload['lastName']))
            ->setAge((int) $payload['age'])
            ->setRole($this->sanitizeString($payload['role']))
            ->setLocation($this->sanitizeString($payload['location']))
            ->setSchoolName($this->sanitizeString($payload['schoolName']))
            ->setCompanyName($this->nullableSanitizedString($payload['companyName'] ?? null))
            ->setBio($this->sanitizeString($payload['bio']))
            ->setEmail($this->cipher->encrypt($plainEmail))
            ->setAvailability($this->sanitizeString($payload['availability']))
            ->setFeatured((bool) $payload['featured'])
            ->setSkills($this->normalizeSkills($payload['skills']))
            ->setProjects($this->normalizeProjects($payload['projects']))
            ->touch();

        $entityManager->flush();

        return $this->json($this->normalizeStudent($student));
    }

    #[Route('/{id}', name: 'api_students_delete', methods: ['DELETE'])]
    public function delete(
        string $id,
        Request $request,
        StudentRepository $studentRepository,
        EntityManagerInterface $entityManager,
    ): JsonResponse {
        if (!$this->isAdminRequest($request)) {
            return $this->json(['error' => 'Action reservee aux comptes admin.'], Response::HTTP_FORBIDDEN);
        }

        $student = $studentRepository->find($id);
        if (!$student instanceof Student) {
            return $this->json(['error' => 'Profil introuvable.'], Response::HTTP_NOT_FOUND);
        }

        $entityManager->remove($student);
        $entityManager->flush();

        return $this->json(['id' => $id]);
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

    /** @param array<string, mixed> $payload
     *  @return array{0: bool, 1: array<int, string>} */
    private function validatePayload(array $payload): array
    {
        $errors = [];

        $requiredStrings = ['firstName', 'lastName', 'role', 'location', 'bio', 'email', 'availability', 'schoolName'];
        foreach ($requiredStrings as $field) {
            if (!isset($payload[$field]) || !is_string($payload[$field]) || trim($payload[$field]) === '') {
                $errors[] = sprintf('Le champ "%s" est requis.', $field);
            }
        }

        if (!isset($payload['age']) || !is_numeric($payload['age']) || (int) $payload['age'] < 16 || (int) $payload['age'] > 99) {
            $errors[] = 'Le champ "age" doit etre un nombre entre 16 et 99.';
        }

        if (!isset($payload['featured']) || !is_bool($payload['featured'])) {
            $errors[] = 'Le champ "featured" doit etre booleen.';
        }

        if (!isset($payload['skills']) || !is_array($payload['skills'])) {
            $errors[] = 'Le champ "skills" doit etre un tableau.';
        }

        if (!isset($payload['projects']) || !is_array($payload['projects'])) {
            $errors[] = 'Le champ "projects" doit etre un tableau.';
        }

        return [count($errors) === 0, $errors];
    }

    /** @param array<int, mixed> $skills
     *  @return array<int, array{name: string, level: string}> */
    private function normalizeSkills(array $skills): array
    {
        $normalized = [];
        $allowedLevels = ['beginner', 'intermediate', 'advanced'];

        foreach ($skills as $skill) {
            if (!is_array($skill)) {
                continue;
            }

            $name = isset($skill['name']) && is_string($skill['name']) ? $this->sanitizeString($skill['name']) : '';
            $level = isset($skill['level']) && is_string($skill['level']) ? strtolower(trim($skill['level'])) : 'beginner';

            if ($name === '') {
                continue;
            }

            $normalized[] = [
                'name' => $name,
                'level' => in_array($level, $allowedLevels, true) ? $level : 'beginner',
            ];
        }

        return $normalized;
    }

    /** @param array<int, mixed> $projects
     *  @return array<int, array{name: string, technologies: array<int, string>, description: string}> */
    private function normalizeProjects(array $projects): array
    {
        $normalized = [];

        foreach ($projects as $project) {
            if (!is_array($project)) {
                continue;
            }

            $name = isset($project['name']) && is_string($project['name']) ? $this->sanitizeString($project['name']) : '';
            $description = isset($project['description']) && is_string($project['description'])
                ? $this->sanitizeString($project['description'])
                : '';

            $technologies = [];
            if (isset($project['technologies']) && is_array($project['technologies'])) {
                foreach ($project['technologies'] as $technology) {
                    if (!is_string($technology)) {
                        continue;
                    }

                    $value = $this->sanitizeString($technology);
                    if ($value !== '') {
                        $technologies[] = $value;
                    }
                }
            }

            if ($name === '' || $description === '') {
                continue;
            }

            $normalized[] = [
                'name' => $name,
                'technologies' => $technologies,
                'description' => $description,
            ];
        }

        return $normalized;
    }

    private function sanitizeString(string $value): string
    {
        return trim(strip_tags($value));
    }

    private function nullableSanitizedString(mixed $value): ?string
    {
        if (!is_string($value)) {
            return null;
        }

        $clean = $this->sanitizeString($value);

        return $clean === '' ? null : $clean;
    }

    private function extractAccountIdFromRequest(Request $request): ?string
    {
        $payload = $request->attributes->get('jwt_payload');
        if (!is_array($payload)) {
            return null;
        }

        $sub = $payload['sub'] ?? null;

        return is_string($sub) && $sub !== '' ? $sub : null;
    }

    private function isAdminRequest(Request $request): bool
    {
        $payload = $request->attributes->get('jwt_payload');
        if (!is_array($payload)) {
            return false;
        }

        return (bool) ($payload['is_admin'] ?? false);
    }

    private function generateStudentId(): string
    {
        return 'stu-'.bin2hex(random_bytes(8));
    }

    /** @return array<string, mixed> */
    private function normalizeStudent(Student $student): array
    {
        return [
            'id' => $student->getId(),
            'firstName' => $student->getFirstName(),
            'lastName' => $student->getLastName(),
            'age' => $student->getAge(),
            'role' => $student->getRole(),
            'location' => $student->getLocation(),
            'schoolName' => $student->getSchoolName(),
            'companyName' => $student->getCompanyName(),
            'bio' => $student->getBio(),
            'email' => $this->cipher->decrypt($student->getEmail()),
            'availability' => $student->getAvailability(),
            'featured' => $student->isFeatured(),
            'skills' => $student->getSkills(),
            'projects' => $student->getProjects(),
        ];
    }
}
