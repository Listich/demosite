<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class News extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'category',
        'location',
        'news_date',
        'startup_id',
        'image_url',
    ];

    public function startup()
    {
        return $this->belongsTo(Project::class, 'startup_id');
    }
}
