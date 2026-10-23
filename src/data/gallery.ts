export type Artwork = {
  id: number
  title: string
  category: string
  creator: string
  year: string
  collection: string
  description: string
  image: string
  ratio: 'tall' | 'wide' | 'square'
}

const photo = (id: string, width = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`

export const artworks: Artwork[] = [
  { id: 1, title: 'The Quiet Between', category: 'Cinematic', creator: 'Mara Sol', year: '2025', collection: 'After the Last Light', description: 'A pause at the edge of a long day, where the landscape holds its breath.', image: photo('photo-1470252649378-9c29740c9fa8'), ratio: 'wide' },
  { id: 2, title: 'Concrete Poetry', category: 'Architecture', creator: 'Elias North', year: '2024', collection: 'Concrete Dreams', description: 'Geometry softened by light, and a city that almost feels weightless.', image: photo('photo-1487958449943-2429e8be8625'), ratio: 'tall' },
  { id: 3, title: 'Blue Hour No. 4', category: 'Nature', creator: 'Mara Sol', year: '2025', collection: 'Quiet Landscapes', description: 'The last blue of the day spills across an empty horizon.', image: photo('photo-1500530855697-b586d89ba3ee'), ratio: 'square' },
  { id: 4, title: 'A Study in Stillness', category: 'Portraits', creator: 'Noah Vale', year: '2023', collection: 'Human Fragments', description: 'An unguarded moment, framed in soft daylight.', image: photo('photo-1534528741775-53994a69daeb'), ratio: 'tall' },
  { id: 5, title: 'Afterimage', category: 'Abstract', creator: 'Studio Morrow', year: '2025', collection: 'The Shape of Silence', description: 'Color and texture in conversation with the things left unsaid.', image: photo('photo-1541701494587-cb58502866ab'), ratio: 'wide' },
  { id: 6, title: 'City, Unscripted', category: 'Urban', creator: 'Elias North', year: '2024', collection: 'Concrete Dreams', description: 'The city between its appointments, briefly belonging to nobody.', image: photo('photo-1519608487953-e999c86e7455'), ratio: 'square' },
  { id: 7, title: 'Soft Wilderness', category: 'Nature', creator: 'Mara Sol', year: '2024', collection: 'Quiet Landscapes', description: 'A mountain range dissolving into the first light of morning.', image: photo('photo-1464822759023-fed622ff2c3b'), ratio: 'tall' },
  { id: 8, title: 'The Long Way Home', category: 'Cinematic', creator: 'Noah Vale', year: '2025', collection: 'After the Last Light', description: 'An open road, the sun falling low, and nowhere else to be.', image: photo('photo-1500534623283-312a69ddc2a9'), ratio: 'wide' },
  { id: 9, title: 'Glass / Shadow', category: 'Architecture', creator: 'Elias North', year: '2023', collection: 'Concrete Dreams', description: 'A modernist silhouette caught between reflection and reality.', image: photo('photo-1511818966892-d7d671e672a2'), ratio: 'square' },
  { id: 10, title: 'Almost a Memory', category: 'Portraits', creator: 'Noah Vale', year: '2024', collection: 'Human Fragments', description: 'The familiar made new by a different kind of attention.', image: photo('photo-1506794778202-cad84cf45f1d'), ratio: 'tall' },
  { id: 11, title: 'Earth, Rewritten', category: 'Abstract', creator: 'Studio Morrow', year: '2025', collection: 'The Shape of Silence', description: 'An abstract landscape shaped by layers, erosion, and time.', image: photo('photo-1509316785289-025f5b846b35'), ratio: 'wide' },
  { id: 12, title: 'Night Geometry', category: 'Urban', creator: 'Elias North', year: '2025', collection: 'Concrete Dreams', description: 'A thousand windows, each carrying a different small universe.', image: photo('photo-1519501025264-65ba15a82390'), ratio: 'square' },
]

export const collections = [
  { title: 'After the Last Light', number: '08', text: 'Stories that begin when the day decides to let go.', image: photo('photo-1470252649378-9c29740c9fa8', 1800), category: 'Cinematic' },
  { title: 'Concrete Dreams', number: '12', text: 'A changing portrait of the spaces we build around ourselves.', image: photo('photo-1487958449943-2429e8be8625', 1800), category: 'Architecture' },
  { title: 'Quiet Landscapes', number: '06', text: 'A little distance from the noise. A little closer to everything.', image: photo('photo-1464822759023-fed622ff2c3b', 1800), category: 'Nature' },
]
