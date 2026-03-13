<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestDriveSubmission extends Model
{
    use HasFactory;

    protected $table = 'test_drive_submissions';

    protected $fillable = [
        'model',
        'nom',
        'prenom',
        'telephone',
        'email',
        'message',
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


