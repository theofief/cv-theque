<?php

namespace App\Security;

class JwtService
{
    public function issueToken(array $claims, int $ttlSeconds = 3600): string
    {
        $header = ['alg' => 'HS256', 'typ' => 'JWT'];
        $now = time();
        $payload = array_merge($claims, [
            'iat' => $now,
            'exp' => $now + $ttlSeconds,
        ]);

        $headerEncoded = $this->base64UrlEncode(json_encode($header, JSON_THROW_ON_ERROR));
        $payloadEncoded = $this->base64UrlEncode(json_encode($payload, JSON_THROW_ON_ERROR));
        $signature = $this->sign(sprintf('%s.%s', $headerEncoded, $payloadEncoded));

        return sprintf('%s.%s.%s', $headerEncoded, $payloadEncoded, $signature);
    }

    /** @return array<string, mixed>|null */
    public function verifyToken(string $token): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        [$headerEncoded, $payloadEncoded, $signatureProvided] = $parts;
        $signatureExpected = $this->sign(sprintf('%s.%s', $headerEncoded, $payloadEncoded));

        if (!hash_equals($signatureExpected, $signatureProvided)) {
            return null;
        }

        $payloadJson = $this->base64UrlDecode($payloadEncoded);
        if ($payloadJson === null) {
            return null;
        }

        $payload = json_decode($payloadJson, true);
        if (!is_array($payload)) {
            return null;
        }

        $expiresAt = $payload['exp'] ?? null;
        if (!is_int($expiresAt) || $expiresAt < time()) {
            return null;
        }

        return $payload;
    }

    private function sign(string $message): string
    {
        $secret = (string) ($_ENV['APP_SECRET'] ?? 'dev-secret');
        $raw = hash_hmac('sha256', $message, $secret, true);

        return $this->base64UrlEncode($raw);
    }

    private function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private function base64UrlDecode(string $data): ?string
    {
        $padding = strlen($data) % 4;
        if ($padding > 0) {
            $data .= str_repeat('=', 4 - $padding);
        }

        $decoded = base64_decode(strtr($data, '-_', '+/'), true);

        return is_string($decoded) ? $decoded : null;
    }
}
