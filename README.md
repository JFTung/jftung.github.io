# jftung.github.io

This is my personal webpage I'm using to learn web development.

## Building Locally

### Requirements

Install Ruby and Bundler:

```
$ sudo apt-get install ruby-dev
$ gem install bundler
```

### Jekyll

Install Jekyll and other dependencies from the GitHub Pages gem by running this
from this repository's root directory:

```
jftung.github.io $ bundle install
```

Build and run the site locally with Jekyll:

```
jftung.github.io $ bundle exec jekyll serve
```

Connect via your web browser at `http://localhost:4000`.

### Troubleshooting

Ensure your GitHub Pages gem is up to date

```
$ gem update
```
