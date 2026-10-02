import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

if __name__ == '__main__':
    url = f"http://localhost:{PORT}/index.html"
    print(f"Uruchamianie gry Super Mario 2D...")
    print(f"Adres serwera: {url}")
    
    # Otwórz przeglądarkę
    try:
        webbrowser.open(url)
    except Exception:
        pass

    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print("Serwer działa. Naciśnij Ctrl+C, aby zakończyć.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nZatrzymano serwer.")
            sys.exit(0)
