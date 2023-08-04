import sys
import os

repoPath = sys.argv[1]

def findFile(name, path):
    for dirs, subdirs, files in os.walk(path):
        if name in files:
            return os.path.join(dirs, name);

def findKeyWord(filePath, word):
    with open(filePath, 'r') as file:
        content = file.read()
        if word in content:
            print("word found")
            return;
    print("word not found")

# check for readme.md
readmePath = findFile("readme.md", repoPath)
print(readmePath)

#check for contributing.md
contributingPath = findFile("contributing.md", repoPath);
print(contributingPath)

#check for confidential keyword in readme file
readmeFile = findKeyWord(readmePath, "confidential")





