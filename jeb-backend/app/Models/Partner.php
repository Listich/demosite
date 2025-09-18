<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Partner extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'legal_status',
        'address',
        'email',
        'phone',
        'description',
        'partnership_type',
    ];
}
