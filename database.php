<?php
header("Content-Type: application/json");

class database
{

    public $conn;
    /**
     * name host for database
     * @var string
     */
    private string $servername;
    /**
     * login for database
     * @var string
     */
    private string $username;
    /**
     * password for database
     * @var string
     */
    private string $password;
    /**
     * name database
     * @var string
     */
    private string $dbname;
    /**
     * check has table Tree
     * @var bool
     */
    private bool $is_table = false;

    /**
     * update for record by id new name value
     * @param $request
     * @return false|string|void
     */
    public function update($request)
    {
        $format = "UPDATE Tree SET name='%s' WHERE id=%d";
        $sql = sprintf($format, $request['name'], $request['id']);
        return $this->analysisRunQuery($sql, 'update', $request);
    }

    /**
     * database constructor.
     * @param $servername
     * @param $username
     * @param $password
     * @param $dbname
     */
    public function __construct($servername, $username, $password, $dbname)
    {
        $this->servername = $servername;
        $this->username = $username;
        $this->password = $password;
        $this->dbname = $dbname;
    }

    public function __destruct()
    {
        $this->conn->close();
    }

    /**
     * Echo database & table created
     * @return string
     */
    public function init(): string
    {
        if (!$this->conn) {
            $this->createDatabase();
        }
        if (!$this->is_table) {
            $this->createTable();
        }
        return 'Database & Table created';
    }

    /**
     * create new record in table Tree
     * @param $request
     * @return false|string|void
     */
    public function store($request)
    {
        $format = "INSERT INTO Tree ( name, parent_id) VALUES ( '%s', %d)";
        $sql = sprintf($format, $request['name'], $request['parent_id']);
        return $this->analysisRunQuery($sql, 'store', $request);
    }

    /**
     * delete record by id
     * @param $request
     * @return false|string|void
     */
    public function delete($request)
    {
        $format = "DELETE FROM Tree WHERE id=%d";
        $sql = sprintf($format, $request['id']);
        return $this->analysisRunQuery($sql, 'delete', $request);
    }

    /**
     * get all records from table Tree
     * @return false|string
     */
    public function index()
    {
        return json_encode($this->fetchTree());
    }

    /**
     * @return void
     */
    private function connect()
    {
        $this->conn = new mysqli($this->servername, $this->username, $this->password, $this->dbname);
    }

    /**
     * @return array of sql query
     */
    private function fetchTree(): array
    {
        $tree = [];
        $result = $this->getTree();
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $tree[] = $row;
            }
        }
        return $tree;
    }

    /**
     * @return mixed
     */
    private function getTree()
    {
        $sql = "SELECT * FROM Tree";
        return $this->runQuery($sql);
    }

    /**
     * @param $sql
     * @return mixed
     */
    private function runQuery($sql)
    {
        return $this->conn->query($sql);
    }

    /**
     * @return bool
     */
    private function createDatabase()
    {
        $sql = "CREATE DATABASE IF NOT EXISTS DB_test;";
        $conn = new mysqli($this->servername, $this->username, $this->password);
        if ($conn->query($sql) === TRUE) {
            $conn->close();
            $this->connect();
            return true;
        } else {
            return false;
        }
    }

    /**
     * @return void
     */
    private function createTable()
    {
        $sql = "SELECT * FROM information_schema.tables
                WHERE table_schema = 'DB_test' 
                AND table_name = 'Tree' LIMIT 1;";
        if ($this->runQuery($sql)->num_rows != 1) {
            $sql = 'CREATE TABLE Tree (
                id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(30) NOT NULL,
                parent_id INT(6))';
            $this->runQuery($sql);
        } else {
            $this->is_table = true;
        }
    }

    private function analysisRunQuery($sql, $type, $request)
    {
        if ($this->runQuery($sql)) {
            switch ($type) {
                case 'store':
                    return json_encode(['result' => 'success', 'message' => 'Store root by id: ' . $this->conn->insert_id, 'id' => $this->conn->insert_id]);
                    break;
                case 'delete':
                    return json_encode(['result' => 'success', 'message' => 'Delete id: ' . $request['id']]);
                    break;
                case 'update':
                    return json_encode(['result' => 'success', 'message' => 'Updated name by id: ' . $request['id']]);
                    break;
            }
        } else {
            return json_encode(['result' => 'error', 'Error: ' => $this->conn->error]);
        }
    }
}

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
// ------------------------------------------------------------------------------------------------
$servername = gethostname(); // host DB
$username = "bvgkzjcegt"; //login DB
$password = "dmCRD5EzGm"; //pass DB
$dbname = "bvgkzjcegt";
$database = new database($servername, $username, $password, $dbname);
$database->init();
/**
 * controller request
 */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    /**
     * echo get records from tree
     */
    echo $database->index();
}
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    /**
     * echo delete record
     */
    echo $database->delete($_REQUEST);
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if ($data['id'] != null) {
        /**
         * update record
         */
        echo $database->update($data);
    } else {
        /**
         *  store new record
         */
        echo $database->store($data);
    }
}
