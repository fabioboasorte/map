<?php

global $pdo;

$dbInfo['server'] = "localhost";
$dbInfo['database'] = "wp_capital";
$dbInfo['username'] = "root";
$dbInfo['password'] = "";

$con = "mysql:host=" . $dbInfo['server'] . "; dbname=" . $dbInfo['database'];
$pdo = new PDO($con, $dbInfo['username'], $dbInfo['password']);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);


/*implementação-dump*/

/*
CREATE TABLE `markers` (
  `ID` int(11) NOT NULL,
  `mark` varchar(255) NOT NULL,
  `x` varchar(255) NOT NULL,
  `y` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `audio` varchar(255) DEFAULT NULL,
  `ck` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

ALTER TABLE `markers`
  ADD PRIMARY KEY (`ID`);
  
ALTER TABLE `markers`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT;
*/
  

?>