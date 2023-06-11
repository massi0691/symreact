<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Post;
use App\Controller\InvoiceIncrementationController;
use App\Repository\InvoiceRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\OpenApi\Model;
use Symfony\Component\Validator\Constraints as Assert;


#[ORM\Entity(repositoryClass: InvoiceRepository::class)]
#[ApiResource(
    paginationEnabled: true,
    paginationItemsPerPage: 20,
    normalizationContext: ['groups' => ["invoices_read", "invoices_sub"]]
)
]
#[ApiResource(
    uriTemplate: '/customers/{id}/invoices',
    uriVariables: [
        'id' => new Link(
            fromClass: Customer::class,
            fromProperty: 'invoices'
        )
    ],
    operations: [
        new GetCollection(normalizationContext: ['groups' => ['sub_inv']]),
        new Post(
            uriTemplate: '/invoices/{id}/increment',
            name: 'increment',
            controller: InvoiceIncrementationController::class,
            openapi: new Model\Operation(
                summary: 'Incrémente une facture',
                description: 'Incrémente le chrono d\'une facture donnée',
            )
        )
    ]
)]
#[ApiFilter(OrderFilter::class)]
class Invoice
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    #[Groups('invoices_read', 'customers_read', 'sub_inv')]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['invoices_read', 'customers_read', 'sub_inv'])]
    #[Assert\NotBlank(message: "le montant de la facture est obligatoire ")]
    #[Assert\Type(type: "numeric", message: "le montant de la facture doit étre un numérique !")]
    private ?float $amount = null;

    #[ORM\Column]
    #[Groups(['invoices_read', 'customers_read', 'sub_inv'])]
    #[Assert\NotBlank(message: "la date d'envoi doit étre rensignée!")]
    private ?\DateTimeImmutable $sentAt = null;

    #[ORM\Column(length: 255)]
    #[Groups(['invoices_read', 'customers_read', 'sub_inv'])]
    #[Assert\NotBlank(message: "le status de la facture obligatoire")]
    #[Assert\Choice(choices: ["SENT","CANCELED","PAID"],message: "le status doit étre SENT , CANCELED, PAID")]
    private ?string $status = null;

    #[ORM\ManyToOne(inversedBy: 'invoices')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['invoices_read'])]
    #[Assert\NotBlank(message: "le client de la facture doit étre rensigner")]
    private ?Customer $customer = null;

    #[ORM\Column]
    #[Groups(['invoices_read', 'customers_read'])]
    #[Assert\NotBlank(message: "il faut absolument un chrono pour la facture")]
    #[Assert\Type(type: "integer",message: "le chrono doit ètre un nombre !")]
    private ?int $chrono = null;

    #[Groups(['invoices_read', 'sub_inv'])]
    public function getUser(): User
    {
        return $this->customer->getUser();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount(float $amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt(): ?\DateTimeImmutable
    {
        return $this->sentAt;
    }

    public function setSentAt($sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono(int $chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
