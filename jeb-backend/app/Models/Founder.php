<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Founder extends Model
{
    use HasFactory;

    protected $fillable = [
        'startup_id',
        'name',
    ];

    public function project() {
        return $this->belongsTo(Project::class);
    }
    public function startup()
    {
        return $this->belongsTo(Startup::class);
    }

}
