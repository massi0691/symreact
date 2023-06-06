<?php

namespace App\Doctrine;

use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\ORM\QueryBuilder;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

class CurrentUserExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface
{

    private Security $security;

    private AuthorizationCheckerInterface $authorizationChecker;

    /**
     * @param Security $security
     * @param AuthorizationCheckerInterface $authorizationChecker
     */
    public function __construct(Security $security, AuthorizationCheckerInterface $authorizationChecker)
    {
        $this->security = $security;
        $this->authorizationChecker = $authorizationChecker;
    }

    private function addWhere(QueryBuilder $queryBuilder, string $resourceClass)
    {
        //1. find currentUser authenticated
        $user = $this->security->getUser();
        // 2. if they ask invoices or customers , then adapt the request with current user
        if (
            ($resourceClass === Customer::class || $resourceClass === Invoice::class) &&
            (!$this->authorizationChecker->isGranted('ROLE_ADMIN')) &&
            ($user instanceof User)
        ) {
            $rootAlias = $queryBuilder->getRootAliases()[0];

            if ($resourceClass === Customer::class) {
                $queryBuilder->andWhere("$rootAlias.user = :user");

            } elseif ($resourceClass === Invoice::class) {
                $queryBuilder->join("$rootAlias.customer", "c")
                    ->andWhere("c.user = :user");
            }

            $queryBuilder->setParameter("user", $user);
        }
    }

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, Operation $operation = null, array $context = []): void
    {
        $this->addWhere($queryBuilder, $resourceClass);
    }

    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, Operation $operation = null, array $context = []): void
    {
        $this->addWhere($queryBuilder, $resourceClass);

    }
}
