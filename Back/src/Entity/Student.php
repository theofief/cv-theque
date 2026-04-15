<?php

namespace App\Entity;

use App\Repository\StudentRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: StudentRepository::class)]
#[ORM\Table(name: 'students')]
class Student
{
    #[ORM\Id]
    #[ORM\Column(length: 64)]
    private ?string $id = null;

    #[ORM\Column(length: 120)]
    private string $firstName = '';

    #[ORM\Column(length: 120)]
    private string $lastName = '';

    #[ORM\Column]
    private int $age = 0;

    #[ORM\Column(length: 180)]
    private string $role = '';

    #[ORM\Column(length: 180)]
    private string $location = '';

    #[ORM\Column(length: 180)]
    private string $schoolName = '';

    #[ORM\Column(length: 180, nullable: true)]
    private ?string $companyName = null;

    #[ORM\Column(length: 64, nullable: true)]
    private ?string $ownerAccountId = null;

    #[ORM\Column(type: Types::TEXT)]
    private string $bio = '';

    #[ORM\Column(length: 255)]
    private string $email = '';

    #[ORM\Column(length: 180)]
    private string $availability = '';

    #[ORM\Column]
    private bool $featured = false;

    /** @var array<int, array{name: string, level: string}> */
    #[ORM\Column(type: Types::JSON)]
    private array $skills = [];

    /** @var array<int, array{name: string, technologies: array<int, string>, description: string}> */
    #[ORM\Column(type: Types::JSON)]
    private array $projects = [];

    #[ORM\Column]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column]
    private \DateTimeImmutable $updatedAt;

    public function __construct()
    {
        $now = new \DateTimeImmutable();
        $this->createdAt = $now;
        $this->updatedAt = $now;
    }

    public function getId(): ?string
    {
        return $this->id;
    }

    public function setId(string $id): self
    {
        $this->id = $id;

        return $this;
    }

    public function getFirstName(): string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getAge(): int
    {
        return $this->age;
    }

    public function setAge(int $age): self
    {
        $this->age = $age;

        return $this;
    }

    public function getRole(): string
    {
        return $this->role;
    }

    public function setRole(string $role): self
    {
        $this->role = $role;

        return $this;
    }

    public function getLocation(): string
    {
        return $this->location;
    }

    public function setLocation(string $location): self
    {
        $this->location = $location;

        return $this;
    }

    public function getSchoolName(): string
    {
        return $this->schoolName;
    }

    public function setSchoolName(string $schoolName): self
    {
        $this->schoolName = $schoolName;

        return $this;
    }

    public function getCompanyName(): ?string
    {
        return $this->companyName;
    }

    public function setCompanyName(?string $companyName): self
    {
        $this->companyName = $companyName;

        return $this;
    }

    public function getOwnerAccountId(): ?string
    {
        return $this->ownerAccountId;
    }

    public function setOwnerAccountId(?string $ownerAccountId): self
    {
        $this->ownerAccountId = $ownerAccountId;

        return $this;
    }

    public function getBio(): string
    {
        return $this->bio;
    }

    public function setBio(string $bio): self
    {
        $this->bio = $bio;

        return $this;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getAvailability(): string
    {
        return $this->availability;
    }

    public function setAvailability(string $availability): self
    {
        $this->availability = $availability;

        return $this;
    }

    public function isFeatured(): bool
    {
        return $this->featured;
    }

    public function setFeatured(bool $featured): self
    {
        $this->featured = $featured;

        return $this;
    }

    /** @return array<int, array{name: string, level: string}> */
    public function getSkills(): array
    {
        return $this->skills;
    }

    /** @param array<int, array{name: string, level: string}> $skills */
    public function setSkills(array $skills): self
    {
        $this->skills = $skills;

        return $this;
    }

    /** @return array<int, array{name: string, technologies: array<int, string>, description: string}> */
    public function getProjects(): array
    {
        return $this->projects;
    }

    /** @param array<int, array{name: string, technologies: array<int, string>, description: string}> $projects */
    public function setProjects(array $projects): self
    {
        $this->projects = $projects;

        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): \DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function touch(): self
    {
        $this->updatedAt = new \DateTimeImmutable();

        return $this;
    }
}
