<?php

namespace App\Events;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class InvoicesChronoSubscriber implements EventSubscriberInterface
{
    /**
     * @var Security
     */
    private Security $security;
    private InvoiceRepository $invoiceRepository;

    public function __construct(Security $security, InvoiceRepository $invoiceRepository)
    {
        $this->security = $security;
        $this->invoiceRepository = $invoiceRepository;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setChronoForInvoice', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setChronoForInvoice(ViewEvent $event)
    {
        $result = $event->getControllerResult();
        $user = $this->security->getUser();
        $method = $event->getRequest()->getMethod();
        if ($result instanceof Invoice && $method === "POST"){
            $nextChrono = $this->invoiceRepository->findNextChrono($user);
            $result->setChrono($nextChrono);
        }
    }
}
