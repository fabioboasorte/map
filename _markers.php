<?php

$action = $_REQUEST['action'];

if($action=='get'||$action=='getView'){
    header('Content-Type: application/json');
    
    switch ($action) {
        case 'getView':
            $markers = getMarkers('view');
            break;
        default:
            $markers = getMarkers('');
            break;
    };
            
    print(json_encode($markers));
};

if($action=='set'){
    $data = $_POST['json'];
    if($data){
        $data = json_decode($data);
        setMarkers($data);
    }
};

if($action=='del'){
    $mark = $_GET['mark'];
    if($mark){
        deleteMarker($mark);
    }
};

if($action=='click'){
    $mark = $_GET['mark'];
    if($mark){
        clickMarker($mark);
    }
};

function setMarkers($data){
    include('_db.php');

    if(!$data)
        return false;
    
    $mark = newMarker($data->mark);

    if($mark){
        foreach ($data as $key => $value) {
            if($key=='mark')
                continue;
            // echo $key . '<br>';
            updateMarker($data->mark, $key, $value);
        }
    }
};

function updateMarker($mark, $key, $value){
    if(!$mark||!$key||!$value)
        return false;
    
    include('_db.php');

    $UP = "UPDATE markers SET ".$key." = '".$value."' WHERE mark = '".$mark."'";
    $pdo->query($UP);    
};

function newMarker($mark){
    if(!$mark)
        return false;
        
    include('_db.php');
    $marker = array();
    try {
        foreach($pdo->query("SELECT * from markers WHERE mark = '".$mark."' LIMIT 1") as $row) {
            $marker['mark'] = $row['mark'];
        }
    } catch (PDOException $e) {
        print "Error!: " . $e->getMessage() . "<br/>";
        die();
    }
    if(!$marker){
        /*novo marcador*/
        $pdo->query("INSERT INTO markers (mark, x, y, ck) VALUES ('".$mark."', 1, 1, 1)");
    }
    return true;
};

function getMarkers($view){
    include('_db.php');
    $marker = array();
    $getMark = isset($_GET['mark']) ? $_GET['mark'] : '';
    $sql = "SELECT * from markers ORDER BY ID";

    if($getMark)
        $sql = "SELECT * from markers WHERE mark = '".$getMark."' LIMIT 1";

    try {
        $i=0;
        foreach($pdo->query($sql) as $row) {
            $marker[$i]['ID'] = $row['ID'];
            $marker[$i]['mark'] = $row['mark'];
            $marker[$i]['x'] = $row['x'];
            $marker[$i]['y'] = $row['y'];
            $marker[$i]['title'] = $row['title'];
            // $marker[$i]['date'] = $row['date'];
            $marker[$i]['data'] = date("d/m/Y", strtotime($row['date']));
            
            if($view){
                $marker[$i]['content'] = nl2br($row['content']);
            }else{
                $marker[$i]['content'] = $row['content'];
            }

            $marker[$i]['audio'] = $row['audio'];
            $marker[$i]['ck'] = $row['ck'];
            $marker[$i]['date'] = $row['date'];
            $i++;
        }
        $pdo = null;
        return $marker;
    } catch (PDOException $e) {
        print "Error!: " . $e->getMessage() . "<br/>";
        die();
    }
};

function deleteMarker($mark){
    include('_db.php');    
    $queryDel = "DELETE FROM markers WHERE mark = '".$mark."' LIMIT 1";
    $pdo->query($queryDel);   
};

function clickMarker($mark){
    include('_db.php');
    
    $ck = $pdo->prepare("SELECT ck FROM markers WHERE mark = '".$mark."' LIMIT 1"); 
    $ck->execute(); 
    $ck = $ck->fetch();
    $newCk = $ck['ck'] + 1;

    updateMarker($mark, 'ck', $newCk);
};

?>