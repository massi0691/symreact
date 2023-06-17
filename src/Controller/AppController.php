<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AppController extends AbstractController
{
    #[Route('/')]
    #[Route('/login')]
    #[Route('/register')]
    #[Route('/customers')]
    #[Route('/customers/{id}')]
    #[Route('/invoices')]
    #[Route('/invoices/{id}')]
    public function index(): Response
    {
        return $this->render('index.html.twig');
    }
}
