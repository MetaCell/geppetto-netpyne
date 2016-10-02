import subprocess


subprocess.check_output('git clone --recursive https://github.com/openworm/org.geppetto.frontend.jupyter.git')
subprocess.check_output('cp -r ../geppetto_neuron org.geppetto.frontend.jupyter/src/geppettoJupyter/geppetto/src/main/webapp/extensions/')

subprocess.check_output('sudo pip install . --upgrade --no-deps --force-reinstal --install-option="--jupyter-notebook-path=\'http://localhost:8888/notebooks/jupyter-frontend/geppetto_demo.ipynb\'"', cwd = 'org.geppetto.frontend.jupyter')


#http://stackoverflow.com/questions/4585929/how-to-use-cp-command-to-exclude-a-specific-directory