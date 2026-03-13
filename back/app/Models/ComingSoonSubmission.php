<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComingSoonSubmission extends Model
{
    use HasFactory;

    protected $table = 'coming_soon_submissions';

    protected $fillable = [
        'nom',
        'prenom',
        'telephone',
        'email',
        'ville',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Accessor for full name
    public function getFullNameAttribute()
    {
        return $this->prenom . ' ' . $this->nom;
    }
}
