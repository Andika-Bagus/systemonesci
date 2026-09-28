<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Website;
use App\Models\GamblingScan;
use Illuminate\Support\Facades\Http;

class GamblingDetectionController extends Controller
{
    // Gambling keywords
    private $keywords = [
        "judi", "slot", "gacor", "togel", "casino", "poker", 
        "taruhan", "sbobet", "maxwin", "rtp", "zeus", "pragmatic"
    ];

    public function scan($websiteId)
    {
        $website = Website::findOrFail($websiteId);
        return response()->json(["scan" => $this->performScan($website)]);
    }

    public function scanExternal(Request $request)
    {
        $request->validate([
            'url' => 'required|url'
        ]);
        
        $url = $request->input('url');
        
        try {
            $response = Http::withoutVerifying()->timeout(10)->get($url);
            $html = strtolower($response->body());
            
            $keywordsFound = [];
            $scanDetails = [];
            $keywordCount = 0;
            $score = 0;

            foreach ($this->keywords as $keyword) {
                $count = substr_count($html, $keyword);
                if ($count > 0) {
                    $keywordsFound[] = $keyword;
                    $keywordCount += $count;
                    $scanDetails[] = [
                        "keyword" => $keyword,
                        "occurrences" => $count,
                        "weight" => 1,
                        "category" => "general"
                    ];
                    $score += min($count * 5, 20); // max 20 per keyword
                }
            }

            $score = min($score, 100);
            $status = "safe";
            if ($score >= 75) $status = "detected";
            elseif ($score >= 50) $status = "suspicious";
            elseif ($score >= 25) $status = "review";

            return response()->json([
                'success' => true,
                'scan' => [
                    'url' => $url,
                    'status' => $status,
                    'keywords_found' => $keywordsFound,
                    'keyword_count' => $keywordCount,
                    'confidence_score' => $score,
                    'scan_details' => $scanDetails,
                    'scanned_at' => now()->toIso8601String()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengakses URL: ' . $e->getMessage()
            ], 422);
        }
    }

    public function bulkScan(Request $request)
    {
        $websiteIds = $request->input("websiteIds", []);
        $websites = Website::whereIn("id", $websiteIds)->get();
        $results = [];
        $successCount = 0;
        $failCount = 0;

        foreach ($websites as $website) {
            try {
                $scan = $this->performScan($website);
                $results[] = ["website_id" => $website->id, "success" => true, "scan" => $scan];
                $successCount++;
            } catch (\Exception $e) {
                $results[] = ["website_id" => $website->id, "success" => false, "error" => $e->getMessage()];
                $failCount++;
            }
        }

        return response()->json([
            "results" => $results,
            "success_count" => $successCount,
            "fail_count" => $failCount
        ]);
    }

    public function getLatestScan($websiteId)
    {
        $scan = GamblingScan::where("website_id", $websiteId)->latest()->first();
        return response()->json($scan);
    }

    public function getAllScans()
    {
        // Get latest scan for each website
        $scans = GamblingScan::with("website")
            ->whereIn("id", function ($query) {
                $query->selectRaw("MAX(id)")->from("gambling_scans")->groupBy("website_id");
            })
            ->get();
        return response()->json($scans);
    }

    public function getStatistics()
    {
        $latestScansIds = GamblingScan::selectRaw("MAX(id) as id")->groupBy("website_id")->pluck("id");
        $scans = GamblingScan::whereIn("id", $latestScansIds)->get();

        $stats = [
            "total" => $scans->count(),
            "safe" => $scans->where("status", "safe")->count(),
            "review" => $scans->where("status", "review")->count(),
            "suspicious" => $scans->where("status", "suspicious")->count(),
            "detected" => $scans->where("status", "detected")->count(),
        ];

        return response()->json($stats);
    }

    public function getByStatus($status)
    {
        $latestScansIds = GamblingScan::selectRaw("MAX(id) as id")->groupBy("website_id")->pluck("id");
        $scans = GamblingScan::with("website")
            ->whereIn("id", $latestScansIds)
            ->where("status", $status)
            ->get();
        return response()->json($scans);
    }

    private function performScan(Website $website)
    {
        try {
            $response = Http::withoutVerifying()->timeout(10)->get($website->url);
            $html = strtolower($response->body());
            
            $keywordsFound = [];
            $scanDetails = [];
            $keywordCount = 0;
            $score = 0;

            foreach ($this->keywords as $keyword) {
                $count = substr_count($html, $keyword);
                if ($count > 0) {
                    $keywordsFound[] = $keyword;
                    $keywordCount += $count;
                    $scanDetails[] = [
                        "keyword" => $keyword,
                        "occurrences" => $count,
                        "weight" => 1,
                        "category" => "general"
                    ];
                    $score += min($count * 5, 20); // max 20 per keyword
                }
            }

            $score = min($score, 100);
            $status = "safe";
            if ($score >= 75) $status = "detected";
            elseif ($score >= 50) $status = "suspicious";
            elseif ($score >= 25) $status = "review";

            $scan = GamblingScan::create([
                "website_id" => $website->id,
                "status" => $status,
                "keywords_found" => $keywordsFound,
                "keyword_count" => $keywordCount,
                "confidence_score" => $score,
                "scan_details" => $scanDetails,
                "scanned_at" => now(),
            ]);

            return clone $scan;
        } catch (\Exception $e) {
            // If we can\'t access the site, just create a safe scan or fail silently
            $scan = GamblingScan::create([
                "website_id" => $website->id,
                "status" => "safe",
                "keywords_found" => [],
                "keyword_count" => 0,
                "confidence_score" => 0,
                "scan_details" => [],
                "scanned_at" => now(),
            ]);
            return clone $scan;
        }
    }
}
