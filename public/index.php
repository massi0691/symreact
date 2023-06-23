<?php

use App\Kernel;

require_once dirname(__DIR__).'/vendor/autoload_runtime.php';
header("Access-Control-Allow-Origin: https://symreact-765ea167ead9.herokuapp.com");
return function (array $context) {
    return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
};
