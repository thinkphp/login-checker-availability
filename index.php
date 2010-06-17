<?php
sleep(1);
if(isset($_GET['username']) && $_GET['username']!="") {

    require_once("config.php");

    $username = $_GET['username'];

    if(!$handler = mysql_connect($host,$user,$pass)){
        throw new Exception(mysql_error($handler));
    }
 
    if(!mysql_select_db($db,$handler)){
        throw new Exception(mysql_error($handler));
    }

    $query = "SELECT * FROM $table WHERE username='".mysql_real_escape_string($username)."'";

    $results = mysql_query($query);

    if(mysql_num_rows($results) > 0) {
       echo"0";
    }else {
       echo"1";
    }

    mysql_close($handler); 
} 

if(isset($_GET['ajax'])) { 

  exit();
}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<html>
<head>
   <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
   <title>Username Checker Availability</title>
   <style type="text/css">
   html,body{font-family: 'lucida grande',tahoma,verdana,arial,sans-serif}
   .available{background: #b9fad0;border: 1px solid #4bf185;}
   .taken{background: #f87c78;border: 1px solid #c00}
   #warninglength{color: #c00;background:#FFE1E1;padding:5px 5px;font-size: 14px}  
   input[type=text]{font-size: 20px;padding: 4px;border: 1px solid #888}
   label{float: left;text-align: right;margin-right: 15px;width: 170px;margin-top: 4px}
   p#headercode{background:#F5F5F5;padding:5px}
   </style>
   <script type="text/javascript" src="moo.js"></script>
   <script type="text/javascript" src="checkerAvailability.js"></script>
   <script type="text/javascript">
 
      window.addEvent('domready',function(){

          var validate = new checkerUsername('username',{
                trigger: 'blur',
                availableImage: 'checkmark.jpg',
                takenImage: 'warning.jpg',
                loading: 'ajax-loader.gif',
                minLength : 3,
                offset:{x: 4,y: 10},
                url: '<?php echo$_SERVER['PHP_SELF'];?>'
          }); 

          //if we have IE
          if(Browser.Engine.trident) {new Request.HTML({url: 'code.html',onSuccess: function(html){$('headercode').set('text','');$('headercode').adopt(html);}}).get();}
                                //otherwise we have FF,Opera,Chrome
                                else 
                                     {$('headercode').load('code.html');}
      });
   </script>
</head>
<body>
<h1>Username Checker Availability</h1>
<fieldset>
<legend>Create an Account</legend>
<p><label for="firstname">First Name: </label><input type="text" id="firstname" name="firstname" /></p>
<p><label for="lastname">Last Name: </label><input type="text" id="lastname" name="lastname" /></p>
<p><label for="username">Desired Login Name: </label><input type="text" id="username" name="username" /></p>
</fieldset>
<p>Try out the AJAX username lookup functionality above. Any username 4 characters or longer will trigger the call. Entering "lancia","larson" will display the 'taken' representation.</p>
<p id="headercode">Loading...</p>
</body>
</html>

