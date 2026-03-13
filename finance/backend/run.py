from app import create_app

app = create_app()

if __name__ == "__main__":
    # This starts the actual web server
    app.run(debug=True, port=5000)  