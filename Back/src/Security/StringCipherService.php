<?php

namespace App\Security;

class StringCipherService
{
    private const PREFIX = 'enc:v1:';

    private string $key;

    public function __construct()
    {
        $this->key = $this->resolveKey();
    }

    public function encrypt(string $plainText): string
    {
        if ($plainText === '') {
            return '';
        }

        if (function_exists('sodium_crypto_secretbox')) {
            $nonce = random_bytes(SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
            $cipherText = sodium_crypto_secretbox($plainText, $nonce, $this->key);

            return self::PREFIX.base64_encode($nonce.$cipherText);
        }

        $iv = random_bytes(12);
        $tag = '';
        $cipherText = openssl_encrypt($plainText, 'aes-256-gcm', $this->key, OPENSSL_RAW_DATA, $iv, $tag);

        if ($cipherText === false) {
            throw new \RuntimeException('Impossible de chiffrer la valeur.');
        }

        return self::PREFIX.base64_encode($iv.$tag.$cipherText);
    }

    public function decrypt(string $encrypted): string
    {
        if ($encrypted === '') {
            return '';
        }

        if (!str_starts_with($encrypted, self::PREFIX)) {
            return $encrypted;
        }

        $payload = base64_decode(substr($encrypted, strlen(self::PREFIX)), true);
        if ($payload === false) {
            return '';
        }

        if (function_exists('sodium_crypto_secretbox_open')) {
            $nonceLength = SODIUM_CRYPTO_SECRETBOX_NONCEBYTES;
            if (strlen($payload) <= $nonceLength) {
                return '';
            }

            $nonce = substr($payload, 0, $nonceLength);
            $cipherText = substr($payload, $nonceLength);
            $plainText = sodium_crypto_secretbox_open($cipherText, $nonce, $this->key);

            return is_string($plainText) ? $plainText : '';
        }

        if (strlen($payload) <= 28) {
            return '';
        }

        $iv = substr($payload, 0, 12);
        $tag = substr($payload, 12, 16);
        $cipherText = substr($payload, 28);

        $plainText = openssl_decrypt($cipherText, 'aes-256-gcm', $this->key, OPENSSL_RAW_DATA, $iv, $tag);

        return is_string($plainText) ? $plainText : '';
    }

    private function resolveKey(): string
    {
        $rawKey = $_ENV['APP_ENCRYPTION_KEY'] ?? '';
        if (is_string($rawKey) && $rawKey !== '') {
            $decoded = base64_decode($rawKey, true);
            if (is_string($decoded) && strlen($decoded) === 32) {
                return $decoded;
            }
        }

        $secret = (string) ($_ENV['APP_SECRET'] ?? 'dev-secret');

        return hash('sha256', $secret, true);
    }
}
