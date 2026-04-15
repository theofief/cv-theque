<?php

namespace App\Controller;

use Doctrine\DBAL\Connection;
use App\Repository\StudentRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
class DirectoryController extends AbstractController
{
    #[Route('/catalog/schools', name: 'api_catalog_schools', methods: ['GET'])]
    public function schoolsCatalog(Connection $connection): JsonResponse
    {
        $schools = $connection->fetchFirstColumn('SELECT name FROM schools ORDER BY name ASC');

        return $this->json(array_values(array_filter($schools, static fn ($name): bool => is_string($name) && $name !== '')));
    }

    #[Route('/catalog/companies', name: 'api_catalog_companies', methods: ['GET'])]
    public function companiesCatalog(Connection $connection): JsonResponse
    {
        $companies = $connection->fetchFirstColumn('SELECT name FROM companies ORDER BY name ASC');

        return $this->json(array_values(array_filter($companies, static fn ($name): bool => is_string($name) && $name !== '')));
    }

    #[Route('/schools', name: 'api_schools_list', methods: ['GET'])]
    public function listSchools(StudentRepository $studentRepository): JsonResponse
    {
        $students = $studentRepository->findAll();
        $stats = [];

        foreach ($students as $student) {
            $school = trim($student->getSchoolName());
            if ($school === '') {
                continue;
            }

            if (!isset($stats[$school])) {
                $stats[$school] = [
                    'name' => $school,
                    'studentsCount' => 0,
                    'featuredCount' => 0,
                ];
            }

            $stats[$school]['studentsCount']++;
            $stats[$school]['featuredCount'] += $student->isFeatured() ? 1 : 0;
        }

        usort($stats, static fn (array $a, array $b): int => strcmp($a['name'], $b['name']));

        return $this->json(array_values($stats));
    }

    #[Route('/schools/{name}', name: 'api_schools_detail', methods: ['GET'])]
    public function schoolDetail(string $name, StudentRepository $studentRepository): JsonResponse
    {
        $schoolName = urldecode($name);
        $students = array_values(array_filter(
            $studentRepository->findAll(),
            static fn ($student): bool => $student->getSchoolName() === $schoolName,
        ));

        if (count($students) === 0) {
            return $this->json(['error' => 'Ecole introuvable.'], Response::HTTP_NOT_FOUND);
        }

        $companies = [];
        $sumAge = 0;

        foreach ($students as $student) {
            $sumAge += $student->getAge();
            $company = trim((string) $student->getCompanyName());
            if ($company === '') {
                continue;
            }

            if (!isset($companies[$company])) {
                $companies[$company] = [
                    'name' => $company,
                    'studentsCount' => 0,
                ];
            }

            $companies[$company]['studentsCount']++;
        }

        usort($companies, static fn (array $a, array $b): int => strcmp($a['name'], $b['name']));

        return $this->json([
            'name' => $schoolName,
            'studentsCount' => count($students),
            'featuredCount' => count(array_filter($students, static fn ($student): bool => $student->isFeatured())),
            'averageAge' => round($sumAge / max(count($students), 1), 1),
            'companies' => array_values($companies),
        ]);
    }

    #[Route('/companies', name: 'api_companies_list', methods: ['GET'])]
    public function listCompanies(StudentRepository $studentRepository): JsonResponse
    {
        $students = $studentRepository->findAll();
        $stats = [];

        foreach ($students as $student) {
            $company = trim((string) $student->getCompanyName());
            if ($company === '') {
                continue;
            }

            if (!isset($stats[$company])) {
                $stats[$company] = [
                    'name' => $company,
                    'studentsCount' => 0,
                    'schoolsCount' => 0,
                    'schools' => [],
                ];
            }

            $stats[$company]['studentsCount']++;
            $school = trim($student->getSchoolName());
            if ($school !== '' && !in_array($school, $stats[$company]['schools'], true)) {
                $stats[$company]['schools'][] = $school;
            }
        }

        foreach ($stats as &$companyStat) {
            $companyStat['schoolsCount'] = count($companyStat['schools']);
            unset($companyStat['schools']);
        }

        usort($stats, static fn (array $a, array $b): int => strcmp($a['name'], $b['name']));

        return $this->json(array_values($stats));
    }

    #[Route('/companies/{name}', name: 'api_companies_detail', methods: ['GET'])]
    public function companyDetail(string $name, StudentRepository $studentRepository): JsonResponse
    {
        $companyName = urldecode($name);
        $students = array_values(array_filter(
            $studentRepository->findAll(),
            static fn ($student): bool => $student->getCompanyName() === $companyName,
        ));

        if (count($students) === 0) {
            return $this->json(['error' => 'Entreprise introuvable.'], Response::HTTP_NOT_FOUND);
        }

        $schools = [];
        foreach ($students as $student) {
            $school = trim($student->getSchoolName());
            if ($school === '') {
                continue;
            }

            if (!isset($schools[$school])) {
                $schools[$school] = [
                    'name' => $school,
                    'studentsCount' => 0,
                ];
            }

            $schools[$school]['studentsCount']++;
        }

        usort($schools, static fn (array $a, array $b): int => strcmp($a['name'], $b['name']));

        return $this->json([
            'name' => $companyName,
            'studentsCount' => count($students),
            'featuredCount' => count(array_filter($students, static fn ($student): bool => $student->isFeatured())),
            'schools' => array_values($schools),
        ]);
    }
}
