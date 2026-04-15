<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260414130000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create students table in SQLite and seed initial profiles';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE students (id VARCHAR(64) NOT NULL, first_name VARCHAR(120) NOT NULL, last_name VARCHAR(120) NOT NULL, age INTEGER NOT NULL, role VARCHAR(180) NOT NULL, location VARCHAR(180) NOT NULL, bio CLOB NOT NULL, email VARCHAR(255) NOT NULL, availability VARCHAR(180) NOT NULL, featured BOOLEAN NOT NULL, skills CLOB NOT NULL --(DC2Type:json)
        , projects CLOB NOT NULL --(DC2Type:json)
        , created_at DATETIME NOT NULL --(DC2Type:datetime_immutable)
        , updated_at DATETIME NOT NULL --(DC2Type:datetime_immutable)
        , PRIMARY KEY(id))');

        $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');

        $this->addSql(
            'INSERT INTO students (id, first_name, last_name, age, role, location, bio, email, availability, featured, skills, projects, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                'stu-1',
                'Lina',
                'Bousquet',
                22,
                'Frontend Developer',
                'Paris',
                'Etudiante en ingenierie web, passionnee par les interfaces produit, la qualite visuelle et les experiences fluides.',
                'lina.bousquet@gott.dev',
                'Disponible en septembre',
                1,
                json_encode([
                    ['name' => 'React', 'level' => 'advanced'],
                    ['name' => 'TypeScript', 'level' => 'intermediate'],
                    ['name' => 'Figma', 'level' => 'advanced'],
                    ['name' => 'Node.js', 'level' => 'intermediate'],
                ], JSON_THROW_ON_ERROR),
                json_encode([
                    [
                        'name' => 'Talent Match',
                        'technologies' => ['React', 'Node.js', 'PostgreSQL'],
                        'description' => 'Plateforme de matching entre talents juniors et entreprises avec recherche multi-criteres.',
                    ],
                    [
                        'name' => 'Design System Campus',
                        'technologies' => ['Figma', 'Storybook', 'React'],
                        'description' => 'Systeme de composants mutualises pour harmoniser les interfaces de plusieurs projets scolaires.',
                    ],
                ], JSON_THROW_ON_ERROR),
                $now,
                $now,
            ]
        );

        $this->addSql(
            'INSERT INTO students (id, first_name, last_name, age, role, location, bio, email, availability, featured, skills, projects, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                'stu-2',
                'Yanis',
                'Charrier',
                24,
                'QA Automation Engineer',
                'Lille',
                'Profil oriente qualite, test et fiabilite produit. J aime structurer les workflows et automatiser les controles.',
                'yanis.charrier@gott.dev',
                'Disponible immediatement',
                0,
                json_encode([
                    ['name' => 'Cypress', 'level' => 'advanced'],
                    ['name' => 'TypeScript', 'level' => 'advanced'],
                    ['name' => 'Vue', 'level' => 'intermediate'],
                    ['name' => 'Playwright', 'level' => 'intermediate'],
                ], JSON_THROW_ON_ERROR),
                json_encode([
                    [
                        'name' => 'E-commerce Test Suite',
                        'technologies' => ['Cypress', 'TypeScript', 'GitHub Actions'],
                        'description' => 'Suite de tests end-to-end et pipeline de validation pour une boutique headless.',
                    ],
                    [
                        'name' => 'Bug Radar',
                        'technologies' => ['Vue', 'Node.js'],
                        'description' => 'Outil interne de suivi des anomalies avec priorisation et tableaux de bord QA.',
                    ],
                ], JSON_THROW_ON_ERROR),
                $now,
                $now,
            ]
        );

        $this->addSql(
            'INSERT INTO students (id, first_name, last_name, age, role, location, bio, email, availability, featured, skills, projects, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                'stu-3',
                'Maya',
                'Renaud',
                21,
                'Product Designer & Frontend',
                'Lyon',
                'J aime relier UX, design et developpement front pour livrer des produits coherents, utiles et accessibles.',
                'maya.renaud@gott.dev',
                'Sous 1 mois',
                1,
                json_encode([
                    ['name' => 'React', 'level' => 'advanced'],
                    ['name' => 'Tailwind', 'level' => 'intermediate'],
                    ['name' => 'GraphQL', 'level' => 'intermediate'],
                    ['name' => 'UI Design', 'level' => 'advanced'],
                ], JSON_THROW_ON_ERROR),
                json_encode([
                    [
                        'name' => 'Analytics Pulse',
                        'technologies' => ['React', 'GraphQL', 'Recharts'],
                        'description' => 'Dashboard analytics temps reel avec vues role-based et visualisations metier.',
                    ],
                    [
                        'name' => 'Inclusive Campus',
                        'technologies' => ['Figma', 'React', 'A11y'],
                        'description' => 'Refonte d un portail campus en priorisant accessibilite et clarte de navigation.',
                    ],
                ], JSON_THROW_ON_ERROR),
                $now,
                $now,
            ]
        );

        $this->addSql(
            'INSERT INTO students (id, first_name, last_name, age, role, location, bio, email, availability, featured, skills, projects, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                'stu-4',
                'Noah',
                'Ferrand',
                23,
                'Full Stack JavaScript',
                'Bordeaux',
                'Developpeur polyvalent attire par les architectures propres, les APIs robustes et les outils collaboratifs.',
                'noah.ferrand@gott.dev',
                'Alternance 4 jours entreprise',
                0,
                json_encode([
                    ['name' => 'React', 'level' => 'intermediate'],
                    ['name' => 'Node.js', 'level' => 'advanced'],
                    ['name' => 'MongoDB', 'level' => 'intermediate'],
                    ['name' => 'Docker', 'level' => 'beginner'],
                ], JSON_THROW_ON_ERROR),
                json_encode([
                    [
                        'name' => 'Campus Connect',
                        'technologies' => ['Node.js', 'MongoDB', 'React'],
                        'description' => 'Application de mise en relation entre associations et etudiants avec gestion de profils.',
                    ],
                    [
                        'name' => 'Deploy Starter',
                        'technologies' => ['Docker', 'Vite', 'Express'],
                        'description' => 'Boilerplate de deploiement local pour accelerer les demos full stack.',
                    ],
                ], JSON_THROW_ON_ERROR),
                $now,
                $now,
            ]
        );
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE students');
    }
}
