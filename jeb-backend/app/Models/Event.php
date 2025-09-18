<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'name',
        'dates',
        'location',
        'description',
        'event_type',
        'target_audience',
        'image_url',
    ];
    protected $hidden = ['created_at', 'updated_at'];

}

