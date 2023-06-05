<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\CustomerRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: CustomerRepository::class)]
#[ApiResource(normalizationContext: ['groups' => ["customers_read"]])]
#[Get,Post,Put,Delete]
#[GetCollection]
#[ApiFilter(SearchFilter::class)]
#[ApiFilter(OrderFilter::class)]
class Customer
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['customers_read', 'invoices_read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['customers_read', 'invoices_read'])]
    #[Assert\NotBlank(message: "Le prénom du customer est obligatoire")]
    #[Assert\Length(min: 3,minMessage: "Le prénom doit faire entre 3 et 255 caractére",max: 255, maxMessage: "Le prénom doit faire entre 3 et 255 caractére")]
    private ?string $firstName = null;

    #[ORM\Column(length: 255)]
    #[Groups(['customers_read', 'invoices_read'])]
    #[Assert\NotBlank(message: "Le nom du customer est obligatoire")]
    #[Assert\Length(min: 3,minMessage: "Le nom doit faire entre 3 et 255 caractére",max: 255, maxMessage: "Le prénom doit faire entre 3 et 255 caractére")]
    private ?string $lastName = null;

    #[ORM\Column(length: 255)]
    #[Groups(['customers_read', 'invoices_read'])]
    #[Assert\NotBlank(message: "Le mail du customer est obligatoire")]
    #[Assert\Email(message: "le format de mail doit étre valide")]
    private ?string $email = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['customers_read'])]
    private ?string $company = null;

    #[ORM\OneToMany(mappedBy: 'customer', targetEntity: Invoice::class)]
    #[Groups(['customers_read'])]
    private Collection $invoices;

    #[ORM\ManyToOne(inversedBy: 'customers')]
    #[Assert\NotBlank(message: "L'utilisateur est obligatoire !")]
    #[Groups(['customers_read'])]
    private ?User $user = null;


    public function __construct()
    {
        $this->invoices = new ArrayCollection();
    }

    /**
     * @return float
     */
    #[Groups(['customers_read'])]
    public function getUnpaidAmount():float
    {
        return array_reduce($this->invoices->toArray(),function($total, $invoice){
            if ($invoice->getStatus() === "PAID" || $invoice->getStatus() === "CANCELED"){
                return $total;
            }else{
                return $total + $invoice->getAmount();
            }

        },0);
    }
    #[Groups(['customers_read'])]
    public function getTotalAmount(): float
    {
        return array_reduce($this->invoices->toArray(),function ($total,$invoice){
            return $total + $invoice->getAmount();
        },0);
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getCompany(): ?string
    {
        return $this->company;
    }

    public function setCompany(?string $company): self
    {
        $this->company = $company;

        return $this;
    }

    /**
     * @return Collection<int, Invoice>
     */
    public function getInvoices(): Collection
    {
        return $this->invoices;
    }

    public function addInvoice(Invoice $invoice): self
    {
        if (!$this->invoices->contains($invoice)) {
            $this->invoices->add($invoice);
            $invoice->setCustomer($this);
        }

        return $this;
    }

    public function removeInvoice(Invoice $invoice): self
    {
        if ($this->invoices->removeElement($invoice)) {
            // set the owning side to null (unless already changed)
            if ($invoice->getCustomer() === $this) {
                $invoice->setCustomer(null);
            }
        }

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }
}
