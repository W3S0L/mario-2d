# 🍄 Super Mario 2D - Retro Platformówka

Klasyczna gra platformowa 2D w stylu kultowego **Super Mario Bros (NES)**, stworzona w czystym JavaScript, HTML5 Canvas i Web Audio API.

## 🚀 Jak uruchomić grę?

Możesz uruchomić grę na kilka bardzo prostych sposobów:

### Sposób 1: Najszybszy (bez instalacji czegokolwiek)
1. Otwórz plik `index.html` bezpośrednio w dowolnej przeglądarce internetowej (Chrome, Edge, Firefox, Opera).
   - Wystarczy **dwukrotnie kliknąć na `index.html`**!

### Sposób 2: Skrypt uruchamiający (Windows)
1. Kliknij dwukrotnie plik `run_game.bat`.
   - Automatycznie uruchomi serwer i otworzy stronę w Twojej przeglądarce.

### Sposób 3: Własny serwer Python
W terminalu / PowerShell w folderze projektu wpisz:
```bash
py server.py
```
Gra otworzy się automatycznie pod adresem: `http://localhost:8000/index.html`.

---

## 🎮 Sterowanie

| Klawisze | Akcja |
| :--- | :--- |
| **A** / **D** lub **←** / **→** | Ruch w lewo / w prawo |
| **SPACJA** / **W** / **Z** | Skok (przytrzymanie = wyższy skok) |
| **SHIFT** / **X** | Bieg (szybszy sprint) / Kula Ognia (Fire Mario) |
| **S** / **↓** | Kucanie (gdy Mario jest powiększony) |
| **P** lub **ESC** | Pauza |
| **M** | Wyciszenie / włączenie muzyki i dźwięków 8-bit |
| **R** | Reset bieżącego poziomu |

*Dostępne są również dotykowe przyciski ekranowe (wirtualny D-Pad i przyciski A/B) do grania na ekranach dotykowych i urządzeniach mobilnych.*

---

## ✨ Kluczowe Cechy i Mechaniki

1. **Fizyka i Sterowanie Mario**:
   - Płynne przyspieszenie, bezwładność, tarcie i efekt hamowania/poślizgu (skid).
   - Zmienna wysokość skoku (variable jump height) w zależności od długości przytrzymania klawisza.
   - Odbijanie się od wrogów (stomping) z dodatkowym wyskokiem przy przytrzymaniu skoku.

2. **Formy Mario i Transformacje**:
   - **Mały Mario (Small Mario)**: Podstawowa forma.
   - **Super Mario (Big Mario)**: Zdobycie czerwonego grzyba powiększa Mario i pozwala rozbijać cegły od dołu.
   - **Ognisty Mario (Fire Mario)**: Zdobycie Ognistego Kwiatka pozwala rzucać odbijającymi się kulami ognia (`[SHIFT]` / `[X]`).

3. **Przeciwnicy**:
   - **Goomba**: Chodzi po planszy, spłaszczany po naskoku z góry, eliminuje Mario przy kontakcie bocznym.
   - **Koopa Troopa**: Naskoczenie chowa go do skorupy. Skorupę można wykopać – pędzi po ziemi, odbija się od rur/ścian i likwiduje wszystkich wrogów na swojej drodze, dając mnożnik punktów!

4. **Interaktywne Bloki i Przedmioty**:
   - **Bloki ze znakiem zapytania [?]**: Animowane, wyskakują z nich monety, Super Grzyby lub Ogniste Kwiaty.
   - **Bloki ceglane (Bricks)**: Mały Mario tylko je podbija, a Duży Mario rozbija je na 4 wirujące odłamki.
   - **Rury kanalizacyjne**: Klasyczne zielone przeszkody o różnych wysokościach.
   - **Podbijanie wrogów**: Uderzenie bloku od dołu niszczy wrogów stojących na nim!

5. **Koniec Poziomu i Przejścia**:
   - Klasyczny maszt z flagą (Flagpole) – zjazd po maszcie, marsz do zamku i podniesienie flagi zamkowej.
   - **Świat 1-1 (Overworld)** i **Świat 1-2 (Underground)**!

6. **Dźwięk i Muzyka Chiptune**:
   - Pełny syntezator 8-bitowy Web Audio API (nie wymaga zewnętrznych plików MP3).
   - Kultowy motyw muzyczny Overworld, fanfara ukończenia poziomu, jingle śmierci, dźwięki zbierania monet, naskoku, grzybów i skoków.
