# JavaScript String Packing Experiment

The project uses Esprima and ESCodegen to refactor a JavaScript program by
merging all duplicated strings into a shared string table. The goal of which
being to reduce the download size of the program while maintaining it's
correctness.

As of now (Dec 2016) - this experiment has not been successful in reducing the
gzipped size of a JavaScript download (while the original size has be reduced,
the effect is to make the gzip file compression less effective, and so the
actual over-the-wire size of the download is not improved).

# Developing

To develop with this repo:

```
$ source tools/use
$ configure-project
$ build-project
$ run-tests
```

As a shortcut, you can also:

```
$ run-tests --build
```

to build the project and run it's tests.
