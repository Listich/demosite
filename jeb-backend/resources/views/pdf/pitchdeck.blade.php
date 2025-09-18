<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Pitch Deck - JEB</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        h1, h2 { color: #1a202c; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; }
    </style>
</head>
<body>
<h1>JEB Pitch Deck</h1>

<p>Utilisateur connecté : <strong>{{ $user->name }}</strong> ({{ $user->email }})</p>

<h2>Statistiques Globales</h2>
<ul>
    <li>Startups : {{ $dashboard['startups_count'] }}</li>
    <li>Projets : {{ $dashboard['projects_count'] }}</li>
    <li>Utilisateurs : {{ $dashboard['users_count'] }}</li>
    <li>Taux d'engagement : {{ $dashboard['engagement_rate'] }}%</li>
    <li>Secteur principal : {{ $dashboard['top_sector'] }}</li>
</ul>

<h2>Startups sélectionnées</h2>
<table>
    <thead>
    <tr>
        <th>Nom</th>
        <th>Statut</th>
        <th>Secteur</th>
        <th>Maturité</th>
    </tr>
    </thead>
    <tbody>
    @foreach($startups as $startup)
        <tr>
            <td>{{ $startup->name }}</td>
            <td>{{ $startup->legal_status }}</td>
            <td>{{ $startup->sector }}</td>
            <td>{{ $startup->maturity }}</td>
        </tr>
    @endforeach
    </tbody>
</table>
</body>
</html>
