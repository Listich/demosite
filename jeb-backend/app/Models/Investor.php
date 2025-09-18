<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Investor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'legal_status',
        'address',
        'email',
        'phone',
        'description',
        'investor_type',
        'investment_focus',
    ];
}
