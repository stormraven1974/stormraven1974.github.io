<?php

class Greeter {
    private $_target = 'World';

    public function getTarget() : string {
        return $this->_target;
    }

    public function sayHello (string $punctuation = "|") : string {
        echo 'Hello, ' . $this->_target . $punctuation;
    }
}

class InformalGreeter extends greeter {

    public function sayHello() : string {
        echo 'Hi, ' . $this->getTarget() . '!';
    }
}

$greeter = new Greeter();
$informalGreeter = new InformalGreeter();

echo "Greeting $greeter->getTarget() ...";
echo $greeter->sayHello('?');
echo "Greeting $informalGreeter->getTarget() ... ";
$informalGreeter->sayHello();
echo PHP_EOL . PHP_EOL . PHP_EOL;
