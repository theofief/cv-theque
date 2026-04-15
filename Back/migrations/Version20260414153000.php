<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260414153000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create schools and companies catalogs with French known entries';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE schools (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(255) NOT NULL)');
        $this->addSql('CREATE UNIQUE INDEX uniq_schools_name ON schools (name)');

        $this->addSql('CREATE TABLE companies (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(255) NOT NULL)');
        $this->addSql('CREATE UNIQUE INDEX uniq_companies_name ON companies (name)');

        $schools = [
            'Sorbonne Universite',
            'Universite PSL',
            'Ecole Polytechnique',
            'CentraleSupelec',
            'ESSEC Business School',
            'HEC Paris',
            'INSA Lyon',
            'Universite Paris-Saclay',
            'Sciences Po',
            'IMT Atlantique',
            'Epitech',
            '42 Paris',
            'Gott Academy',
        ];

        foreach ($schools as $school) {
            $this->addSql('INSERT INTO schools (name) VALUES (?)', [$school]);
        }

        $companies = [
            'Capgemini',
            'Sopra Steria',
            'Orange',
            'Airbus',
            'Thales',
            'Doctolib',
            'BlaBlaCar',
            'Back Market',
            'OVHcloud',
            'TechNova',
            'Digital Forge',
        ];

        foreach ($companies as $company) {
            $this->addSql('INSERT INTO companies (name) VALUES (?)', [$company]);
        }
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE schools');
        $this->addSql('DROP TABLE companies');
    }
}
