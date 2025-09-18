<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Project extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'description',
        'founders',
        'contact_email',
        'website',
        'needs',
        'progress',
        'legal_status',
        'address',
        'phone',
        'sector',
        'maturity',
    ];

    protected $casts = [
        'needs' => 'array',
        'created_at' => 'date:Y-m-d',
        'updated_at' => 'datetime',
    ];

    public function founders()
    {
        return $this->hasMany(Founder::class);
    }
}
