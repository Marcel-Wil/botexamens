<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AllowOnlyLocalRequests
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */

    protected $proxies = '*'; // or ['127.0.0.1'] if you want to be strict

    protected $headers = Request::HEADER_X_FORWARDED_ALL;

    public function handle($request, Closure $next)
    {
        $ip = $request->ip();

        // Allow local IPs
        if (in_array($ip, ['127.0.0.1', '::1'])) {
            return $next($request);
        }

        // Optionally allow internal network IPs (like 192.168.x.x)
        if (preg_match('/^192\.168\./', $ip) || preg_match('/^10\./', $ip)) {
            return $next($request);
        }

        return response()->json(['message' => 'Forbidden'], 403);
    }

}