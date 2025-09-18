<?php
namespace App\Console\Commands;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use App\Models\Project;
use App\Models\Founder;
use App\Models\Startup;
use App\Models\Investor;
use App\Models\Partner;
use App\Models\News;
use App\Models\Event;
use App\Models\User;

class SyncJeb extends Command
{
    protected $signature = 'sync:jeb';
    protected $description = "Importe toutes les données depuis l'API JEB dans la base de données";


    public function handle()
    {
        $token = config('services.jeb.token');

    // Import startups + projets + fondateurs
        $response = Http::withHeaders([
            'X-Group-Authorization' => $token,
        ])->get('https://api.jeb-incubator.com/startups', [
            'limit' => 100,
            'skip' => 0,
        ]);

        if ($response->failed()) {
            $this->error(' Boooo Erreur lors de l\'appel à l\'API JEB');
            $this->line('Status: ' . $response->status());
            $this->line('Body: ' . $response->body());
            return;
        }

        $startups = $response->json();
        $count = 0;


        foreach ($startups as $startup) {
            $project = Project::updateOrCreate(
                ['name' => $startup['name']],
                [
                    'description' => $startup['legal_status'] ?? null,
                    'founders' => null,
                    'contact_email' => $startup['email'] ?? null,
                    'website' => null,
                    'needs' => [],
                    'progress' => $startup['maturity'] ?? null,
                    'legal_status' => $startup['legal_status'] ?? null,
                    'address' => $startup['address'] ?? null,
                    'phone' => $startup['phone'] ?? null,
                    'sector' => $startup['sector'] ?? null,
                    'maturity' => $startup['maturity'] ?? null,
                ]
            );


            $count++;


            $detailsResponse = Http::withHeaders([
                'X-Group-Authorization' => $token,
            ])->get("https://api.jeb-incubator.com/startups/{$startup['id']}");


            if ($detailsResponse->successful()) {
                $data = $detailsResponse->json();


                $localStartup = Startup::updateOrCreate(
                    ['id' => $startup['id']],
                    [
                        'name' => $startup['name'],
                        'email' => $startup['email'] ?? null,
                        'sector' => $startup['sector'] ?? null,
                        'maturity' => $startup['maturity'] ?? null,
                        'address' => $startup['address'] ?? null,
                        'phone' => $startup['phone'] ?? null,
                        'legal_status' => $startup['legal_status'] ?? null,
                    ]
                );
                if (!empty($data['founders']) && is_array($data['founders'])) {
                    $addedFounderNames = [];

                    foreach ($data['founders'] as $founder) {
                        $founderName = trim(strtolower($founder['name'] ?? 'unknown'));
                        $uniqueKey = $localStartup->id . '|' . $founderName;

                        if (in_array($uniqueKey, $addedFounderNames)) {
                            continue;
                        }

                        $addedFounderNames[] = $uniqueKey;

                        $imageUrl = null;

                        $imageResponse = Http::withHeaders([
                            'X-Group-Authorization' => $token,
                        ])->get("https://api.jeb-incubator.com/startups/{$startup['id']}/founders/{$founder['id']}/image");

                        if ($imageResponse->successful()) {
                            $imageContent = $imageResponse->body();
                            $fileName = "founders/{$founder['id']}.jpg";
                            Storage::disk('public')->put($fileName, $imageContent);
                            $imageUrl = Storage::url($fileName);
                        }
                        Founder::updateOrCreate(
                            [
                                'project_id' => $project->id,
                                'startup_id' => $localStartup->id,
                                'name' => $founder['name'] ?? 'Unknown',
                            ],
                            [
                                'image_url' => $imageUrl,
                            ]
                        );
                        $this->line("Yesss {$founder['name']} ajouté à la startup ID {$localStartup->id} (projet ID {$project->id})");
                    }
                }
            }
        }
        $this->info("yes $count startups (et leurs fondateurs) importées avec succès depuis l'API JEB !");
        // Import investisseurs

        $this->info("Import des investisseurs...");

        $investorsResponse = Http::withHeaders([
            'X-Group-Authorization' => $token,
        ])->get('https://api.jeb-incubator.com/investors', [
            'limit' => 100,
            'skip' => 0,
        ]);

        if ($investorsResponse->successful()) {
            $investors = $investorsResponse->json();

            foreach ($investors as $investor) {
                \App\Models\Investor::updateOrCreate(
                    ['name' => $investor['name']],
                    [
                        'legal_status' => $investor['legal_status'] ?? null,
                        'address' => $investor['address'] ?? null,
                        'email' => $investor['email'] ?? null,
                        'phone' => $investor['phone'] ?? null,
                        'description' => $investor['description'] ?? null,
                        'investor_type' => $investor['investor_type'] ?? null,
                        'investment_focus' => $investor['investment_focus'] ?? null,
                    ]
                );
            }

            $this->info("OK " . count($investors) . " investisseurs importés avec succès !");
        } else {
            $this->error("Boooo Échec lors de l'import des investisseurs.");
            $this->line('Status: ' . $investorsResponse->status());
            $this->line('Body: ' . $investorsResponse->body());
        }

        $this->info("Import des partenaires...");

        $response = Http::withHeaders([
            'X-Group-Authorization' => $token,
        ])->get('https://api.jeb-incubator.com/partners', [
            'limit' => 100,
            'skip' => 0,
        ]);

        if ($response->successful()) {
            $partners = $response->json();
            foreach ($partners as $partner) {
                \App\Models\Partner::updateOrCreate(
                    ['name' => $partner['name']],
                    [
                        'legal_status' => $partner['legal_status'] ?? null,
                        'address' => $partner['address'] ?? null,
                        'email' => $partner['email'] ?? null,
                        'phone' => $partner['phone'] ?? null,
                        'description' => $partner['description'] ?? null,
                        'partnership_type' => $partner['partnership_type'] ?? null,
                    ]
                );
            }
            $this->info("Yess" . count($partners) . " partenaires importés avec succès !");
        } else {
            $this->error(" Booo Erreur lors de l’appel à l’API partners");
        }

        // Import news
        $this->info('Import des news...');

        $response = Http::withHeaders([
            'X-Group-Authorization' => config('services.jeb.token'),
        ])->get('https://api.jeb-incubator.com/news', [
            'limit' => 100,
            'skip' => 0,
        ]);

        if ($response->failed()) {
            $this->error(' Erreur lors de l\'appel à l\'API JEB (news)');
            return;
        }

        $items = $response->json();
        $count = 0;

        foreach ($items as $item) {
            $news = \App\Models\News::updateOrCreate(
                ['title' => $item['title']],
                [
                    'news_date' => $item['news_date'] ?? null,
                    'location' => $item['location'] ?? null,
                    'category' => $item['category'] ?? null,
                    'startup_id' => $item['startup_id'] ?? null,
                ]
            );

            $imageResponse = Http::withHeaders([
                'X-Group-Authorization' => $token,
            ])->get("https://api.jeb-incubator.com/news/{$item['id']}/image");

            if ($imageResponse->successful()) {
                $responseData = $imageResponse->json();

                if (isset($responseData['image_url']) && !empty($responseData['image_url'])) {
                    $imageUrl = $responseData['image_url'];

                    if (filter_var($imageUrl, FILTER_VALIDATE_URL)) {
                        $imageData = Http::get($imageUrl);

                        if ($imageData->successful()) {
                            $path = "news/{$news->id}.jpg";
                            Storage::disk('public')->put($path, $imageData->body());
                            $news->image_url = asset("storage/{$path}");
                            $news->save();
                        } else {
                            $this->line("Mince  Impossible de télécharger l'image pour la news ID {$news->id}");
                        }
                    } else {
                        $this->line("Haaa  URL d'image invalide pour la news ID {$news->id}: {$imageUrl}");
                    }
                } else {
                    $imageContent = $imageResponse->body();

                    if (!empty($imageContent) && strlen($imageContent) > 100) {
                        $path = "news/{$news->id}.jpg";
                        Storage::disk('public')->put($path, $imageContent);
                        $news->image_url = asset("storage/{$path}");
                        $news->save();
                    } else {
                        $this->line(" Alors laaa Pas de données d'image valides pour la news ID {$news->id}");
                    }
                }
            } else {
                $this->line("Booo Impossible de récupérer l'image pour la news ID {$news->id}");
            }

            $count++;
        }
        $this->info("Parfait $count news importées avec succès !");

        // Import des Events
        $this->info('Import des Events...');

        $response = Http::withHeaders([
            'X-Group-Authorization' => config('services.jeb.token'),
        ])->get('https://api.jeb-incubator.com/events', [
            'limit' => 100,
            'skip' => 0,
        ]);

        if ($response->failed()) {
            $this->error("Booo Erreur lors de l'import des events...");
            return;
        }

        $items = $response->json();
        $count = 0;

        foreach ($items as $item) {
            $event = \App\Models\Event::updateOrCreate(
                ['name' => $item['name']],
                [
                    'dates' => $item['dates'] ?? null,
                    'location' => $item['location'] ?? null,
                    'description' => $item['description'] ?? null,
                    'event_type' => $item['event_type'] ?? null,
                    'target_audience' => $item['target_audience'] ?? null,
                ]
            );
            if (isset($item['id'])) {
                $imageResponse = Http::withHeaders([
                    'X-Group-Authorization' => config('services.jeb.token'),
                ])->get("https://api.jeb-incubator.com/events/{$item['id']}/image");

                if ($imageResponse->successful()) {
                    $imageContent = $imageResponse->body();

                    if (!empty($imageContent) && strlen($imageContent) > 100) {
                        $filename = "{$event->id}.jpg";
                        $path = "events/{$filename}";

                        Storage::disk('public')->put($path, $imageContent);

                        $event->image_url = $filename;
                        $event->save();

                        $this->line(" Yes Image sauvegardée pour: {$event->name}");
                    } else {
                        $this->line("Ahhh  Image vide ou non valide pour: {$event->name}");
                    }
                } else {
                    $this->line("Minceee  Aucune image récupérée pour: {$event->name}");
                }
            }
            $count++;
        }
        $this->info("Yeeee $count événements importés avec succès !");

        //Import utilisateurs
        $this->info("Import des utilisateurs...");

        $response = Http::withHeaders([
            'X-Group-Authorization' => config('services.jeb.token'),
        ])->get('https://api.jeb-incubator.com/users', [
            'limit' => 100,
            'skip' => 0,
        ]);

        if ($response->failed()) {
            $this->error(" Échec lors de l'appel à l'API JEB (users)");
            return;
        }
        $users = $response->json();
        $count = 0;
        foreach ($users as $userData) {
            $imagePath = null;
            $imageResponse = Http::withHeaders([
                'X-Group-Authorization' => config('services.jeb.token'),
            ])->get("https://api.jeb-incubator.com/users/{$userData['id']}/image");

            if ($imageResponse->successful()) {
                $imageContent = $imageResponse->body();
                if (strlen($imageContent) > 100) {
                    $imageFile = "users/{$userData['id']}.jpg";
                    Storage::disk('public')->put($imageFile, $imageContent);
                    $imagePath = $imageFile;
                }
            }
            $founderId = $userData['founder_id'] ?? null;
            $investorId = $userData['investor_id'] ?? null;

            if ($founderId && !Founder::find($founderId)) {
                $this->line(" Founder ID $founderId non trouvé, utilisateur non lié.");
                $founderId = null;
            }
            if ($investorId && !Investor::find($investorId)) {
                $this->line(" Investor ID $investorId non trouvé, utilisateur non lié.");
                $investorId = null;
            }
            User::updateOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'role' => $userData['role'] ?? 'guest',
                    'founder_id' => $founderId,
                    'investor_id' => $investorId,
                    'password' => bcrypt('password'),
                    'image_path' => $imagePath,
                ]
            );
            $count++;
        }
        $this->info("OK $count utilisateurs importés avec succès !");
    }
}
