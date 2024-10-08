<?php

define("DBNAME","cybersec");
define("DBUSER","root");
define("DBPASS","vagrant");

function db_connection() {

    try{
        $conn = new PDO("mysql:host=localhost;dbname=".DBNAME,DBUSER,DBPASS);
        // $conn = new PDO('mysql:host=34.236.106.171;dbname=israel_locanse_tech',"israel","israel@adcc");

        $conn -> setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
        return $conn;
    }catch(PDOException $e){
        die($e->getMessage());
    }
}

$conn = db_connection();



if (isset($_GET)) {
  if (!empty($_GET)) {
    $data = json_encode($_GET);
    $stmt = $conn->prepare("INSERT INTO bank_attack (data, date_created, time_created) VALUES(?, NOW(), NOW() ) ");
    $stmt->execute([$data]);
  }

}

 ?>
