<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260414145000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create accounts and extend students with school/company ownership links';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE accounts (id VARCHAR(64) NOT NULL, email VARCHAR(255) NOT NULL, password_hash VARCHAR(255) NOT NULL, profile_type VARCHAR(32) NOT NULL, display_name VARCHAR(180) NOT NULL, is_admin BOOLEAN NOT NULL, school_name VARCHAR(180) DEFAULT NULL, company_name VARCHAR(180) DEFAULT NULL, created_at DATETIME NOT NULL --(DC2Type:datetime_immutable)
        , PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX uniq_accounts_email ON accounts (email)');

        $this->addSql("ALTER TABLE students ADD school_name VARCHAR(180) DEFAULT 'Gott Academy' NOT NULL");
        $this->addSql('ALTER TABLE students ADD company_name VARCHAR(180) DEFAULT NULL');
        $this->addSql('ALTER TABLE students ADD owner_account_id VARCHAR(64) DEFAULT NULL');

        $this->addSql('UPDATE students SET school_name = ? WHERE school_name IS NULL OR school_name = ?', ['Gott Academy', '']);

        $passwordHash = password_hash((string) ($_ENV['API_ADMIN_PASSWORD'] ?? 'admin-change'), PASSWORD_DEFAULT);
        $this->addSql(
            'INSERT INTO accounts (id, email, password_hash, profile_type, display_name, is_admin, school_name, company_name, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
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

        $this->addSql("UPDATE students SET company_name = 'TechNova' WHERE id IN ('stu-1', 'stu-3')");
        $this->addSql("UPDATE students SET company_name = 'Digital Forge' WHERE id IN ('stu-2')");
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE accounts');
        $this->addSql('ALTER TABLE students DROP school_name');
        $this->addSql('ALTER TABLE students DROP company_name');
        $this->addSql('ALTER TABLE students DROP owner_account_id');
    }
}
