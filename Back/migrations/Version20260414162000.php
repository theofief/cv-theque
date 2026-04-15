<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260414162000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Ensure a default admin account exists and remains admin';
    }

    public function up(Schema $schema): void
    {
        $password = (string) ($_ENV['API_ADMIN_PASSWORD'] ?? 'admin-change');
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        $this->addSql(
            'INSERT OR IGNORE INTO accounts (id, email, password_hash, profile_type, display_name, is_admin, school_name, company_name, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                'acc-admin',
                'admin@gott.dev',
                $passwordHash,
                'school',
                'Gott Admin',
                1,
                'Gott Academy',
                null,
                (new \DateTimeImmutable())->format('Y-m-d H:i:s'),
            ]
        );

        $this->addSql(
            'UPDATE accounts SET is_admin = 1, password_hash = ?, profile_type = ?, display_name = ?, school_name = ? WHERE email = ?',
            [
                $passwordHash,
                'school',
                'Gott Admin',
                'Gott Academy',
                'admin@gott.dev',
            ]
        );
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DELETE FROM accounts WHERE email = ?', ['admin@gott.dev']);
    }
}
