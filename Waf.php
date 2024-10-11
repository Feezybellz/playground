<?php
    
    class WAF {
        private $patterns = [
            '/<script\b[^>]*>(.*?)<\/script>/is', // XSS
            '/UNION\s+SELECT/i',                  // SQL Injection
            '/(?:from|select|insert|delete|where|drop table|show tables|#|\*|--|\\\\)/i', // SQL keywords
            '/(\.\.\/|\.\.\\\)/',                 // Directory Traversal
            '/base64_decode/i',                   // Encoding function abuse
            '/(\bOR\b|\bAND\b).*?=\s*.*?\b/i',    // SQL Injection
            '/sleep\(\s*\d+\s*\)/i'               // SQL Time-based Injection
        ];
        
        private $maxRequestsPerMinute = 60; // Max allowed requests per IP per minute
        private $ipBlacklistFile = 'blacklisted_ips.txt';
        private $attackLogFile = 'attack_log.txt';
        
        public function __construct() {
            $this->sanitizeGlobalInputs();
            $this->checkForMaliciousPatterns();
            $this->throttleRequests();
        }
    
        private function sanitizeGlobalInputs() {
            $_GET = filter_input_array(INPUT_GET, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $_POST = filter_input_array(INPUT_POST, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $_COOKIE = filter_input_array(INPUT_COOKIE, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        }
    
        private function detectAttack($input) {
            foreach ($this->patterns as $pattern) {
                if (preg_match($pattern, $input)) {
                    return true;
                }
            }
            return false;
        }
    
        private function checkForMaliciousPatterns() {
            foreach ($_GET as $value) {
                if ($this->detectAttack($value)) {
                    $this->logAndBlock();
                }
            }
            foreach ($_POST as $value) {
                if ($this->detectAttack($value)) {
                    $this->logAndBlock();
                }
            }
            foreach ($_COOKIE as $value) {
                if ($this->detectAttack($value)) {
                    $this->logAndBlock();
                }
            }
        }
        
        private function throttleRequests() {
            $ip = $_SERVER['REMOTE_ADDR'];
            $currentMinute = time();
            
            session_start();
            
            if (!isset($_SESSION['request_count'])) {
                $_SESSION['request_count'] = [];
            }
            
            if (!isset($_SESSION['request_count'][$ip])) {
                $_SESSION['request_count'][$ip] = [];
            }
            
            $_SESSION['request_count'][$ip] = array_filter(
                $_SESSION['request_count'][$ip],
                function($timestamp) use ($currentMinute) {
                    return ($currentMinute - $timestamp) < 60;
                }
            );
            
            $_SESSION['request_count'][$ip][] = $currentMinute;
            
            if (count($_SESSION['request_count'][$ip]) > $this->maxRequestsPerMinute) {
                $this->blockIp($ip);
                $this->logAndBlock();
            }
        }
    
        private function blockIp($ip) {
            file_put_contents($this->ipBlacklistFile, $ip . "\n", FILE_APPEND);
        }
    
        private function isIpBlocked($ip) {
            $blacklist = file($this->ipBlacklistFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            return in_array($ip, $blacklist);
        }
    
        private function logAndBlock() {
            $ip = $_SERVER['REMOTE_ADDR'];
            $url = $_SERVER['REQUEST_URI'];
            $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
            
            $logEntry = sprintf(
                "[%s] IP: %s - URL: %s - User Agent: %s - Attempt blocked.\n",
                date('Y-m-d H:i:s'),
                $ip,
                $url,
                $userAgent
            );
    
            file_put_contents($this->attackLogFile, $logEntry, FILE_APPEND);
    
            header('HTTP/1.1 403 Forbidden');
            die('Access Forbidden');
        }
    }
    
    // Initialize WAF
    $waf = new WAF();
    
?>