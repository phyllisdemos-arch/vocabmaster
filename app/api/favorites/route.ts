import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const FAVORITES_FILE = path.join(process.cwd(), 'public', 'favorites.json');

// Ensure favorites.json exists
function ensureFavoritesFile() {
  if (!fs.existsSync(FAVORITES_FILE)) {
    fs.writeFileSync(FAVORITES_FILE, JSON.stringify([], null, 2));
  }
}

// GET - Fetch all favorites
export async function GET() {
  try {
    ensureFavoritesFile();
    const data = fs.readFileSync(FAVORITES_FILE, 'utf-8');
    const favorites = JSON.parse(data);
    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Error reading favorites:', error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST - Add to favorites
export async function POST(request: NextRequest) {
  try {
    ensureFavoritesFile();
    const data = fs.readFileSync(FAVORITES_FILE, 'utf-8');
    let favorites = JSON.parse(data);

    const word = await request.json();

    // Only add if word has an id
    if (!word.id) {
      return NextResponse.json({ error: 'Word must have an id' }, { status: 400 });
    }

    // Remove any existing favorites with the same id (prevent duplicates)
    favorites = favorites.filter((f: any) => f.id !== word.id);

    // Add the word with isFavorite set to true
    favorites.push({ ...word, isFavorite: true });

    // Sort by id for consistency
    favorites.sort((a: any, b: any) => {
      if (a.id && b.id) {
        return a.id.localeCompare(b.id);
      }
      return 0;
    });

    fs.writeFileSync(FAVORITES_FILE, JSON.stringify(favorites, null, 2));

    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
  }
}

// DELETE - Remove from favorites
export async function DELETE(request: NextRequest) {
  try {
    ensureFavoritesFile();
    const data = fs.readFileSync(FAVORITES_FILE, 'utf-8');
    let favorites = JSON.parse(data);

    const { searchParams } = new URL(request.url);
    const wordId = searchParams.get('id');

    if (wordId) {
      favorites = favorites.filter((f: any) => f.id !== parseInt(wordId));
      fs.writeFileSync(FAVORITES_FILE, JSON.stringify(favorites, null, 2));
    }

    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
  }
}
