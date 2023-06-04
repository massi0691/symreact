<?php

namespace App\DataFixtures;

use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{

    private UserPasswordHasherInterface $hasher;

    public function __construct(UserPasswordHasherInterface $hasher)
    {
        $this->hasher = $hasher;
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr-Fr');
        for ($k = 0; $k < 10 ; $k++) {
            $user = new User();
            $chrono=1;
            $hash = $this->hasher->hashPassword($user,'password');

              $user->setFirstName($faker->firstName())
                  ->setLastName($faker->lastName())
                  ->setEmail($faker->email())
                  ->setPassword($hash);

              $manager->persist($user);

            for ($i = 0; $i < mt_rand(5,20); $i++) {
                $customer = new Customer();
                $customer->setFirstName($faker->firstName())
                    ->setLastName($faker->lastName())
                    ->setEmail($faker->email())
                    ->setCompany($faker->company())
                    ->setUser($user);
                $manager->persist($customer);

                for ($j = 0; $j < mt_rand(3,10); $j++) {
                    $invoice = new Invoice();
                    $invoice->setAmount($faker->randomFloat(2,250,5000))
                        ->setSentAt(\DateTimeImmutable::createFromMutable($faker->dateTimeBetween('-6 months')))
                        ->setStatus($faker->randomElement(['PAID','SENT','CANCELED']))
                        ->setCustomer($customer)
                        ->setChrono($chrono);
                    $chrono++;
                    $manager->persist($invoice);
                }
            }
        }




        $manager->flush();
    }
}
