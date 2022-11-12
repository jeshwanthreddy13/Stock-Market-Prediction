from setuptools import setup

with open("README.md", 'r') as f:
    long_description = f.read()

setup(
   name='Soft Actor Critic Bot',
   version='1.0',
   description='Soft Actor Critic Bot',
   license="Apache License 2.0",
   long_description=long_description,
   packages=['src'],
)