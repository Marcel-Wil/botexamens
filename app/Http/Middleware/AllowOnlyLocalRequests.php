<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AllowOnlyLocalRequests
{
    /** @var list<string> */
    private array $allowedIps = [
        '159.223.13.156',
        '127.0.0.1',
        '::1',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        if (! in_array($request->ip(), $this->allowedIps)) {
            abort(403);
        }

        return $next($request);
    }
}
