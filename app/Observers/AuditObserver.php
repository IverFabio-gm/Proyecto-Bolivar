<?php

namespace App\Observers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AuditObserver
{
    public function created(Model $modelo): void
    {
        $this->registrar('create', $modelo, [], $modelo->getAttributes());
    }

    public function updated(Model $modelo): void
    {
        $this->registrar('update', $modelo, $modelo->getOriginal(), $modelo->getChanges());
    }

    public function deleted(Model $modelo): void
    {
        $this->registrar('delete', $modelo, $modelo->getAttributes(), []);
    }

    private function registrar(string $accion, Model $modelo, array $anterior, array $nuevo): void
    {
        if ($modelo->getTable() === 'audit_logs') {
            return;
        }

        DB::table('audit_logs')->insert([
            'id' => Str::uuid(),
            'user_id' => Auth::id(),
            'accion' => $accion,
            'modelo_afectado' => $modelo->getTable(),
            'modelo_id' => $modelo->getKey(),
            'datos_anteriores' => empty($anterior) ? null : json_encode($anterior),
            'datos_nuevos' => empty($nuevo) ? null : json_encode($nuevo),
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
            'deleted' => false,
        ]);
    }
}