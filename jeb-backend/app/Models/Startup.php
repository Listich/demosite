<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Founder;
use App\Models\Project;

class Startup extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'legal_status',
        'address',
        'email',
        'phone',
        'description',
        'website_url',
        'social_media_url',
        'project_status',
        'needs',
        'sector',
        'maturity',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function founders()
    {
        return $this->hasMany(Founder::class);
    }
}
