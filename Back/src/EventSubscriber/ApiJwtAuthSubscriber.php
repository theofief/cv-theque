<?php

namespace App\EventSubscriber;

use App\Security\JwtService;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class ApiJwtAuthSubscriber implements EventSubscriberInterface
{
    public function __construct(private readonly JwtService $jwtService)
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => 'onKernelRequest',
        ];
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $request = $event->getRequest();

        if (!$this->isProtectedRoute($request)) {
            return;
        }

        $authorization = $request->headers->get('Authorization', '');
        if (!str_starts_with($authorization, 'Bearer ')) {
            $event->setResponse(new JsonResponse(['error' => 'Authentification requise.'], 401));

            return;
        }

        $token = trim(substr($authorization, 7));
        $payload = $this->jwtService->verifyToken($token);
        if ($payload === null) {
            $event->setResponse(new JsonResponse(['error' => 'Token invalide ou expire.'], 401));

            return;
        }

        $request->attributes->set('jwt_payload', $payload);
    }

    private function isProtectedRoute(Request $request): bool
    {
        if ($request->isMethod('GET') || $request->isMethod('OPTIONS')) {
            return false;
        }

        return str_starts_with($request->getPathInfo(), '/api/students');
    }
}
