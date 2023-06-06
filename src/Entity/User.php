<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ApiResource(normalizationContext: ['groups'=> 'users_read'])]
#[UniqueEntity('email', message: "l'utilisteur ayant cette addresse email existe déja")]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['customers_read','invoices_read','sub_inv','users_read'])]

    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    #[Groups(['customers_read','invoices_read','sub_inv','users_read'])]
    #[Assert\NotBlank(message: "l'email doit etre rensigner ")]
    #[Assert\Email(message: "le mail doit etre valide")]

    private ?string $email = null;

    #[ORM\Column]
    #[Groups(['customers_read','users_read'])]

    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    #[Assert\NotBlank(message: "Le mot de passe est obligatoire")]
    private ?string $password = null;

    #[ORM\Column(length: 255)]
    #[Groups(['customers_read','invoices_read','sub_inv','users_read'])]
    #[Assert\NotBlank(message: "Le prénom du customer est obligatoire")]
    #[Assert\Length(min: 3,minMessage: "Le prénom doit faire entre 3 et 255 caractére",max: 255, maxMessage: "Le prénom doit faire entre 3 et 255 caractére")]


    private ?string $firstName = null;

    #[ORM\Column(length: 255)]
    #[Groups(['customers_read','invoices_read','sub_inv','users_read'])]
    #[Assert\NotBlank(message: "Le nom du customer est obligatoire")]
    #[Assert\Length(min: 3,minMessage: "Le nom doit faire entre 3 et 255 caractére",max: 255, maxMessage: "Le prénom doit faire entre 3 et 255 caractére")]



    private ?string $lastName = null;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Customer::class)]
    private Collection $customers;

    public function __construct()
    {
        $this->customers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
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

    /**
     * @return Collection<int, Customer>
     */
    public function getCustomers(): Collection
    {
        return $this->customers;
    }

    public function addCustomer(Customer $customer): self
    {
        if (!$this->customers->contains($customer)) {
            $this->customers->add($customer);
            $customer->setUser($this);
        }

        return $this;
    }

    public function removeCustomer(Customer $customer): self
    {
        if ($this->customers->removeElement($customer)) {
            // set the owning side to null (unless already changed)
            if ($customer->getUser() === $this) {
                $customer->setUser(null);
            }
        }

        return $this;
    }
}
