<?php

namespace App\Events;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtCreatedSubscriber
{

    public function updateJwtData(JWTCreatedEvent $event)
    {
        // 1. find user  for his firstName and lastName
        $user = $event->getUser();

        // 2 . the data response send him other data

        $data = $event->getData();

        $data['firstName'] = $user->getFirstName();
        $data['lastName'] = $user->getLastName();
        $event->setData($data);
    }

}
