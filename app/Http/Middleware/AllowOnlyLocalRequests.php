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
    public function handle($request, Closure $next)
    {
        $allowed = ['127.0.0.1', '::1'];
        if (!in_array($request->ip(), $allowed)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        return $next($request);
    }
}