<?php


namespace App\Controller;

use App\Entity\Invoice;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class InvoiceIncrementationController extends AbstractController
{

    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager){}

    /**
     * @param Invoice $data
     * @return Invoice
     */
    public function  __invoke(Invoice $data):Invoice
    {
        $data->setChrono($data->getChrono() + 1);
        $this->entityManager->flush();
        return $data;
    }


}
