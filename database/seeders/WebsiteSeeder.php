<?php

namespace Database\Seeders;

use App\Models\Website;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WebsiteSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $websites = [
            [
                'holding' => 'PT Ridwan Institute',
                'jenis_website' => 'Corporate',
                'url' => 'https://ridwaninstitute.co.id/',
                'letak_server' => 'Indonesia',
                'pic' => 'Admin IT',
            ],
            [
                'holding' => 'Riviera Publishing',
                'jenis_website' => 'Publishing',
                'url' => 'https://rivierapublishing.id',
                'letak_server' => 'Indonesia',
                'pic' => 'Admin IT',
            ],
        ];

        foreach ($websites as $website) {
            Website::create($website);
        }
    }
}
